import { Roles } from 'meteor/alanning:roles';
import { sortBy, isEqual } from 'lodash';
import { safeDump, safeLoad } from 'js-yaml';
import { Credentials } from '../imports/api/credentials';
import { Endpoints } from '../imports/api/endpoints/endpoints.collection';
import { GlobalSettings } from '../imports/api/globalSettings/globalSettings.collection';
import { Projects } from '../imports/api/project/project.collection';
import { Stories } from '../imports/api/story/stories.collection';
import { StoryGroups } from '../imports/api/storyGroups/storyGroups.collection';
import { aggregateEvents } from '../imports/lib/story.utils';
import { indexBotResponse } from '../imports/api/graphql/botResponses/mongo/botResponses';
import { indexStory } from '../imports/api/story/stories.index';
import Activity from '../imports/api/graphql/activity/activity.model';
import AnalyticsDashboards from '../imports/api/graphql/analyticsDashboards/analyticsDashboards.model';
import { defaultDashboard } from '../imports/api/graphql/analyticsDashboards/generateDefaults';

/* globals Migrations */

Migrations.add({
    version: 1,
    up: () => {
        Meteor.users
            .find()
            .fetch()
            .forEach((u) => {
                const { roles = [] } = u;
                const isAdmin = !!roles.find(r => r._id === 'admin');
                if (isAdmin) {
                    Roles.removeUsersFromRoles(u._id, 'admin');
                    Roles.addUsersToRoles(u._id, 'global-admin');
                }
            });
    },
});

Migrations.add({
    version: 2,
    up: () => {
        Credentials.find({ environment: { $exists: false } })
            .fetch()
            .forEach((i) => {
                Credentials.update(
                    { _id: i._id },
                    { $set: { environment: 'development' } },
                );
            });
        Endpoints.find({ environment: { $exists: false } })
            .fetch()
            .forEach((i) => {
                Endpoints.update(
                    { _id: i._id },
                    { $set: { environment: 'development' } },
                );
            });
    },
});

Migrations.add({
    // Its version 2 on CE
    version: 3,
    // add default default domain to global settings, and update projects to have this default domain
    up: () => {
        const privateSettings = safeLoad(Assets.getText(
            process.env.MODE === 'development'
                ? 'defaults/private.dev.yaml'
                : process.env.MODE === 'test' ? 'defaults/private.yaml' : 'defaults/private.gke.yaml',
        ));
        const defaultDefaultDomain = safeDump(privateSettings.defaultDomain);

        GlobalSettings.update({ _id: 'SETTINGS' }, { $set: { 'settings.private.defaultDefaultDomain': defaultDefaultDomain } });

        Projects.find().fetch()
            .forEach((i) => {
                Projects.update({ _id: i._id }, { $set: { defaultDomain: { content: defaultDefaultDomain } } });
            });
    },
});

// eslint-disable-next-line import/first
import assert from 'assert';
// eslint-disable-next-line import/first
import BotResponses from '../imports/api/graphql/botResponses/botResponses.model';


const migrateResponses = () => {
    const countUtterMatches = (templateValues) => {
        const re = /utter_/g;
        return ((JSON.stringify(templateValues) || '').match(re) || []).length;
    };
    try {
        Projects.find()
            .fetch()
            .forEach((p) => {
                if (p.templates) {
                    const templates = sortBy(p.templates, 'key');
                    const newTemplates = [];
                    const duplicates = [];
                    templates.forEach((t, index) => {
                        // Delete irrelevant fields and set new _id
                        delete t.match;
                        delete t.followUp;
                        t.projectId = p._id;
                        // Put duplicates in a separate list
                        if ((index < templates.length - 1 && t.key === templates[index + 1].key) || (index > 0 && t.key === templates[index - 1].key)) {
                            duplicates.push(t);
                        } else {
                            newTemplates.push(t);
                        }
                    });
                    let i = 0;
                    while (i < duplicates.length) {
                        let numberOfOccurence = 1;
                        while (i + numberOfOccurence < duplicates.length && duplicates[i].key === duplicates[i + numberOfOccurence].key) {
                            numberOfOccurence += 1;
                        }
                        const duplicateValues = duplicates.slice(i, i + numberOfOccurence);
                        assert(Array.from(new Set(duplicateValues.map(t => t.key))).length === 1); // Make sure duplicates are real
                        // Count times /utter_/ is a match
                        const utters = duplicateValues.map(t => countUtterMatches(t.values));
                        // Find the index of the template with less /utter_/ in it. This is the value we'll keep
                        const index = utters.indexOf(Math.min(...utters));
                        // Push the template we keep in the array of valid bot responses
                        newTemplates.push(duplicateValues[index]);
                        i += numberOfOccurence;
                    }

                    // Integrity check
                    const distinctInDuplicates = [...new Set(duplicates.map(d => d.key))].length;
                    // duplicates.length - distinctInDuplicates: give back the number of occurence of a value minus one
                    assert(newTemplates.length === templates.length - (duplicates.length - distinctInDuplicates));
                    assert(Array.from(new Set(newTemplates)).length === newTemplates.length);
                    // Insert bot responses in new collection
                    newTemplates.forEach((response) => {
                        BotResponses.updateOne({ key: response.key, projectId: response.projectId }, response, { upsert: true, setDefaultsOnInsert: true }).exec();
                    });
                    // Remote bot responses from project
                    Projects.update({ _id: p._id }, { $unset: { templates: '' } });
                }
            });
    } catch (err) {
        console.log(`The bot responses migration encountered an error: ${err}`);
    }
};

// migrateResponses();
Migrations.add({
    version: 4,
    // add default default domain to global settings, and update projects to have this default domain
    up: () => migrateResponses(),
});
Migrations.add({
    version: 5,
    up: () => {
        const allStories = Stories.find().fetch();
        allStories.forEach((story) => {
            const events = aggregateEvents(story);
            Stories.update({ _id: story._id }, { $set: { events } });
        });
    },
});


// instances: type: nlu -> server
const processSequence = sequence => sequence
    .map(s => safeLoad(s.content))
    .reduce((acc, curr) => {
        const newSequent = {};
        if (curr.text && !acc.text) newSequent.text = curr.text;
        if (curr.text && acc.text) newSequent.text = `${acc.text}\n\n${curr.text}`;
        if (curr.buttons) newSequent.buttons = [...(acc.buttons || []), ...curr.buttons];
        return newSequent;
    }, {});

Migrations.add({
    version: 6,
    // join sequences of text in responsesa
    up: () => {
        BotResponses.find().lean().then(responses => responses.forEach((response) => {
            const updatedResponse = {
                ...response,
                values: response.values.map(value => ({
                    ...value,
                    sequence: [{ content: safeDump(processSequence(value.sequence)) }], //
                })),
            };
            delete updatedResponse._id;
            if (!isEqual(response, updatedResponse)) {
                const { projectId, key } = response;
                BotResponses.updateOne({ projectId, key }, updatedResponse).exec();
            }
        }));
    },
});
Migrations.add({
    version: 7,
    // Remove object ids from activities
    up: async () => {
        Activity.find()
            .lean()
            .then(activities => activities.forEach(async (activity) => {
                if (typeof activity._id !== 'string') {
                    try {
                        const { _id, ...activityWithoutId } = activity;
                        await Activity.deleteOne(activityWithoutId);
                        const idString = activity._id.toString();

                        await Activity.create({
                            _id: idString,
                            ...activityWithoutId,
                        });
                    } catch (e) {
                        console.log(
                            'something went wrong during a migration, contact Botfront for further help',
                        );
                    }
                }
            }));
    },
});
Migrations.add({
    version: 8,
    // add webhooks in private global settings: EE-SPECIFIC
    up: () => {
        const { webhooks } = safeLoad(Assets.getText(
            process.env.MODE === 'development'
                ? 'defaults/private.dev.yaml'
                : process.env.MODE === 'test' ? 'defaults/private.yaml' : 'defaults/private.gke.yaml',
        ));
        GlobalSettings.update({ _id: 'SETTINGS' }, { $set: { 'settings.private.webhooks': webhooks } });
    },
});

Migrations.add({
    version: 9,
    // Migrates to roles v3
    up: () => {
        // eslint-disable-next-line no-underscore-dangle
        Roles._forwardMigrate2();
    },
    down: () => {
        // eslint-disable-next-line no-underscore-dangle
        Roles._backwardMigrate2();
    },
});

Migrations.add({
    version: 10,
    up: () => {
        Roles.deleteRole('conversations-editor');
        Roles.deleteRole('conversations-viewer');
        Roles.deleteRole('conversations:r');
        Roles.deleteRole('conversations:w');
        Roles.deleteRole('copy-editor');
        Roles.deleteRole('copy-viewer');
        Roles.deleteRole('nlu-model:r');
        Roles.deleteRole('nlu-model:w');
        Roles.deleteRole('nlu-model:x');
        Roles.deleteRole('nlu-viewer');
        Roles.deleteRole('owner');
        Roles.deleteRole('project-settings:r');
        Roles.deleteRole('project-settings:w');
        Roles.deleteRole('project-viewer');
    },
    down: () => {

    },
});

Migrations.add({
    version: 11, // CE version 7
    // Touch up on story and storygroup schema
    up: async () => {
        const stories = Stories.find().fetch();
        const children = {};
        const projectIds = new Set();

        stories.forEach((s) => {
            // add to list of children
            children[s.storyGroupId] = [...(children[s.storyGroupId] || []), s._id];
            projectIds.add(s.projectId);
        });
        Array.from(projectIds).forEach((projectId) => {
            StoryGroups.insert({
                name: 'Stories with triggers',
                projectId,
                smartGroup: { prefix: 'withTriggers', query: '{ "rules.0.payload": { "$exists": true } }' },
                isExpanded: true,
            });
        });

        const storyGroups = StoryGroups.find().fetch();
        storyGroups.sort((a, b) => b.introStory - a.introStory);

        storyGroups.forEach(sg => StoryGroups.update(
            { _id: sg._id },
            {
                $set: {
                    isExpanded: !!sg.introStory,
                    children: children[sg._id],
                },
            },
        ));

        // add storygroup key under projects
        Array.from(projectIds).forEach((projectId) => {
            const storyGroupsForProject = storyGroups
                .filter(sg => sg.projectId === projectId)
                .map(sg => sg._id);
            Projects.update({ _id: projectId }, { $set: { storyGroups: storyGroupsForProject } });
        });
    },
});


Migrations.add({
    version: 12,
    up: () => {
        BotResponses.find()
            .lean()
            .then((botResponses) => {
                botResponses.forEach((botResponse) => {
                    const textIndex = indexBotResponse(botResponse);
                    BotResponses.updateOne({ _id: botResponse._id }, { textIndex }).exec();
                });
            });
        const allStories = Stories.find().fetch();
        allStories.forEach((story) => {
            const { textIndex } = indexStory(story);
            Stories.update({ _id: story._id }, { $set: { textIndex } });
        });
    },
});

Migrations.add({ // EE-SPECIFIC!
    version: 13,
    up: () => {
        Roles.deleteRole('nlu-editor');
    },
    down: () => {
    },
});

Migrations.add({ // EE-SPECIFIC!
    version: 14,
    up: () => {
        Projects.find().fetch()
            .forEach(project => AnalyticsDashboards.create(defaultDashboard(project)));
    },
});

Migrations.add({
    version: 15,
    up: () => {
        const allStories = Stories.find().fetch();
        allStories.forEach((story) => {
            const { textIndex, events } = indexStory(story, { includeEventsField: true });
            Stories.update({ _id: story._id }, { $set: { textIndex, events } });
        });
    },
});

Migrations.add({
    version: 16,
    up: () => {
        StoryGroups.update( // add pinned status to smart groups
            { smartGroup: { $exists: true } },
            { $set: { pinned: true } },
            { multi: true },
        );
        Projects.find().fetch() // put them at the top
            .forEach(({ _id: projectId, storyGroups }) => {
                const pinned = StoryGroups.find({ projectId, pinned: true }, { _id: 1 }).fetch().map(({ _id }) => _id);
                const storyGroupsSorted = storyGroups.sort((a, b) => pinned.includes(b) - pinned.includes(a));
                Projects.update({ _id: projectId }, { $set: { storyGroups: storyGroupsSorted } });
            });
    },
});


Migrations.add({
    version: 17,
    up: async () => {
        const { webhooks } = safeLoad(Assets.getText(
            process.env.MODE === 'development'
                ? 'defaults/private.dev.yaml'
                : process.env.MODE === 'test' ? 'defaults/private.yaml' : 'defaults/private.gke.yaml',
        ));
        GlobalSettings.update({ _id: 'SETTINGS' }, { $set: { 'settings.private.webhooks.deploymentWebhook': webhooks.deploymentWebhook } });
        
        const stories = Stories.find().fetch();
        const projectIds = new Set();

        stories.forEach((s) => {
            projectIds.add(s.projectId);
        });
        Array.from(projectIds).forEach((projectId) => {
            StoryGroups.insert({
                name: 'Unpublished stories',
                projectId,
                smartGroup: { prefix: 'unpublish', query: '{ "status": "unpublished" }' },
                isExpanded: false,
                pinned: true,
            });
        });
        Stories.update({}, { $set: { status: 'published' } }, { multi: true });
    },
});

Migrations.add({
    version: 18,
    up: async () => {
        const checkIsTypeButtons = (content) => {
            // the only type defining key in the response content should be buttons
            const included = ['image', 'buttons', 'elements', 'custom', 'attachment', 'quick_replies']
                .filter(k => Object.keys(content).includes(k));
            return included.length === 1 && included[0] === 'buttons';
        };

        const updateContent = (sequence) => {
            const content = safeLoad(sequence.content);
            // check if it is a buttons response
            if (!checkIsTypeButtons(content)) throw new Error('not a buttons response');
            // replace buttons with quick replies
            content.quick_replies = content.buttons;
            delete content.buttons;
            return { ...sequence, content: safeDump(content) };
        };

        // start migration
        const responses = await BotResponses.find().lean();
        if (!responses || !responses.length) return;
        
        const updatedResponses = responses.reduce((buttonResponses, response) => {
            try {
                const values = response.values.map(value => ({
                    ...value, sequence: value.sequence.map(updateContent),
                }));
                return [...buttonResponses, { ...response, values }];
            } catch (err) {
                // we do not need to update the response if it is not a buttons response
                return buttonResponses;
            }
        }, []);

        updatedResponses.forEach((response) => {
            BotResponses.update(updatedResponses);
            const { projectId, key } = response;
            const { _id, ...rest } = response;
            BotResponses.updateOne({ projectId, key }, rest).exec();
        });
    },
});

Migrations.add({
    version: 19,
    up: async () => {
        const { webhooks } = safeLoad(Assets.getText(
            process.env.MODE === 'development'
                ? 'defaults/private.dev.yaml'
                : process.env.MODE === 'test' ? 'defaults/private.yaml' : 'defaults/private.gke.yaml',
        ));
        GlobalSettings.update({ _id: 'SETTINGS' }, { $set: { 'settings.private.webhooks.reportCrashWebhook': webhooks.reportCrashWebhook } });
    },
});

Meteor.startup(() => {
    Migrations.migrateTo('latest');
});

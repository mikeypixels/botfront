import React from "react";
import './bootstrap.min.css';
import './icons.min.css';
import './app.min.css';

export default function MyComponent() {
    return (  
    <div className="page-content">
    <div className="container-fluid">
      <div className="d-lg-flex mb-4">
        {/* users list */}
        <div className="chat-leftsidebar card">
          <div className="p-3">
            <div className="search-box chat-search-box">
              <div className="position-relative">
                <input type="text" className="form-control bg-light border-light rounded" placeholder="Search..." />
              </div>
            </div>
          </div>
          <div className="pb-1">
            <div data-simplebar style={{maxHeight: 'calc(80vh - 45px)'}}>
              <div>
                <div>
                  <ul className="list-unstyled chat-list">
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="user-chat card">
          <div className="p-3 px-lg-4 border-bottom contentHeader">
            <div className="row">
              <div className="col-md-4 col-6">
                <h5 className="font-size-16 mb-0 text-truncate"><a href="javascript:void(0)" className="text-dark userName" /></h5>
                <p className="text-muted text-truncate mb-0 userTime" />
              </div>
            </div>
          </div>
          <div className="px-lg-0">
            <div className="p-3">
              <div className="chat-conversation" dstyle="z-index: 0;">
                <div style={{maxHeight: 'calc(80vh - 55px)', paddingBottom: '30px'}} data-simplebar>
                  <ul className="list-unstyled mb-0 userChats">
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-2 chat-input-section">
              <input type="text" className="form-control chat-input rounded" placeholder="Type a message..." />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
    }

import React from "react";
import './bootstrap.min.css';
import './icons.min.css';
import './app.min.css';


export default function MyComponent() {
    return (  
    <div className="page-content">
    <div className="container-fluid">
      <div className="d-lg-flex mb-4">
        <div className="chat-leftsidebar card">
          <div className="p-3">
            <div className="search-box chat-search-box">
              <div className="position-relative">
                <input type="text" className="form-control bg-light border-light rounded" placeholder="Search..." />
                <i className="uil uil-search search-icon" />
              </div>
            </div>
          </div>
          <div className="pb-3">
            <div data-simplebar style={{maxHeight: '470px'}}>
              <div className="p-4 border-top">
                <div>
                  <h5 className="font-size-16 mb-3"><i className="uil uil-user me-1" /> Contacts</h5>
                  <ul className="list-unstyled chat-list">
                    <li>
                      <a href="#">
                        <div className="d-flex align-items-start">
                          <div className="flex-shrink-0 me-3 align-self-center">
                            <div className="user-img online">
                              <img src="/images/avatars/avatar-2.jpg" className="rounded-circle avatar-xs" alt="" />
                              <span className="user-status" />
                            </div>
                          </div>
                          <div className="flex-grow-1 overflow-hidden">
                            <h5 className="text-truncate font-size-14 mb-1">John Howard</h5>
                            <p className="text-truncate mb-0">Hey! there I'm available</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="font-size-11">02 min</div>
                          </div>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 user-chat mt-4 mt-sm-0 ms-lg-1">
          <div className="card">
            <div className="p-3 px-lg-4 border-bottom">
              <div className="row">
                <div className="col-md-4 col-6">
                  <h5 className="font-size-16 mb-1 text-truncate"><a href="#" className="text-dark">John Howard</a></h5>
                  <p className="text-muted text-truncate mb-0"><i className="uil uil-users-alt me-1" /> 12 Members</p>
                </div>
                <div className="col-md-8 col-6">
                  <ul className="list-inline user-chat-nav text-end mb-0">
                    <li className="list-inline-item">
                      <div className="dropdown">
                        <button className="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="uil uil-search" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-end dropdown-menu-md">
                          <form className="p-2">
                            <div>
                              <input type="text" className="form-control rounded" placeholder="Search..." />
                            </div>
                          </form>
                        </div>
                      </div>
                    </li>
                    <li className="list-inline-item">
                      <div className="dropdown">
                        <button className="btn nav-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i className="uil uil-ellipsis-h" />
                        </button>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">Profile</a>
                          <a className="dropdown-item" href="#">Archive</a>
                          <a className="dropdown-item" href="#">Muted</a>
                          <a className="dropdown-item" href="#">Delete</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="px-lg-2">
              <div className="chat-conversation p-3">
                <ul className="list-unstyled mb-0" data-simplebar style={{maxHeight: '455px'}}>
                  <li className="chat-day-title">
                    <div className="title">Today</div>
                  </li>
                  <li>
                    <div className="conversation-list">
                      <div className="ctext-wrap">
                        <div className="ctext-wrap-content">
                          <h5 className="font-size-14 conversation-name"><a href="#" className="text-dark">John Howard</a> <span className="d-inline-block font-size-12 text-muted ms-2">10:00</span></h5>
                          <p className="mb-0">
                            Good morning everyone !
                          </p>
                        </div>
                        <div className="dropdown align-self-start">
                          <a className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="uil uil-ellipsis-v" />
                          </a>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Copy</a>
                            <a className="dropdown-item" href="#">Save</a>
                            <a className="dropdown-item" href="#">Forward</a>
                            <a className="dropdown-item" href="#">Delete</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="right">
                    <div className="conversation-list">
                      <div className="ctext-wrap">
                        <div className="ctext-wrap-content">
                          <h5 className="font-size-14 conversation-name"><a href="#" className="text-dark">Marcus</a> <span className="d-inline-block font-size-12 text-muted ms-2">10:02</span></h5>
                          <p className="mb-0">
                            Good morning John !
                          </p>
                        </div>
                        <div className="dropdown align-self-start">
                          <a className="dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="uil uil-ellipsis-v" />
                          </a>
                          <div className="dropdown-menu">
                            <a className="dropdown-item" href="#">Copy</a>
                            <a className="dropdown-item" href="#">Save</a>
                            <a className="dropdown-item" href="#">Forward</a>
                            <a className="dropdown-item" href="#">Delete</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="p-3 chat-input-section">
              <div className="row">
                <div className="col">
                  <div className="position-relative">
                    <input type="text" className="form-control chat-input rounded" placeholder="Enter Message..." />
                  </div>
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-primary chat-send w-md waves-effect waves-light"><span className="d-none d-sm-inline-block me-2">Send</span> <i className="mdi mdi-send float-end" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    );
    };

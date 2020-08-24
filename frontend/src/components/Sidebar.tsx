// import React, { useState, useRef } from 'react';
// import { NavLink } from 'react-router-dom';

// // reactstrap components
// import { Nav, Collapse, Button } from 'reactstrap';

// // core components
// import avatar from 'assets/img/ryan.jpg';
// import logo from 'logo-white.svg';
// import { SneakerTraderRoute, View } from 'routes';

// type SideBarBackgroundColor = 'blue' | 'yellow' | 'green' | 'orange' | 'red';
// interface SideBarProps {
//   // TODO: type this
//   routes: any[];
//   showNotification: boolean;
//   backgroundColor: SideBarBackgroundColor;
//   minimizeSidebar: () => void;
// }

// const defaultProps = {
//   routes: [],
//   showNotification: false,
//   backgroundColor: 'blue' as SideBarBackgroundColor,
//   minimizeSidebar: () => {},
// };

// // this verifies if any of the collapses should be default opened on a rerender of this component
// // for example, on the refresh of the page, while on the src/views/forms/RegularForms.js - route /admin/regular-forms
// const getCollapseInitialState = (routes: SneakerTraderRoute[]) => {
//   for (let i = 0; i < routes.length; i++) {
//     if (routes[i].collapse && getCollapseInitialState(routes[i].views as View[])) {
//       return true;
//     } else if (window.location.href.indexOf(routes[i].path) !== -1) {
//       return true;
//     }
//   }
//   return false;
// };

// // this creates the intial state of this component based on the collapse routes
// // that it gets through props.routes
// const getCollapseStates = (routes: SneakerTraderRoute[]) => {
//   let initialState = {};

//   routes.map((route) => {
//     if (route.collapse) {
//       initialState = {
//         [route.state]: getCollapseInitialState(route.views),
//         ...getCollapseStates(route.views),
//         ...initialState,
//       };
//     }

//     return null;
//   });

//   return initialState;
// };

// // TODO: type this component properly
// const Sidebar = (props: SideBarProps = defaultProps) => {
//   const [collapseStates, setCollapseStates] = useState(getCollapseStates(props.routes));
//   const [openAvatar, setOpenAvatar] = useState(false);
//   // TODO: type this
//   const sidebar = useRef<any>(null);

//   // this function creates the links and collapses that appear in the sidebar (left menu)
//   const createLinks = (routes: SneakerTraderRoute[]) => {
//     return routes.map((route, idx) => {
//       if (route.collapse) {
//         let st = {};
//         st[route.state] = !this.state[prop.state];
//         return (
//           <li className={this.getCollapseInitialState(prop.views) ? 'active' : ''} key={idx}>
//             <a
//               href='#pablo'
//               data-toggle='collapse'
//               aria-expanded={this.state[prop.state]}
//               onClick={(e) => {
//                 e.preventDefault();
//                 this.setState(st);
//               }}
//             >
//               {route.icon ? (
//                 <>
//                   <i className={route.icon} />
//                   <p>
//                     {route.name}
//                     <b className='caret' />
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <span className='sidebar-mini-icon'>{route.mini}</span>
//                   <span className='sidebar-normal'>
//                     {route.name}
//                     <b className='caret' />
//                   </span>
//                 </>
//               )}
//             </a>
//             <Collapse isOpen={collapseStates[route.state]}>
//               <ul className='nav'>{this.createLinks(prop.views)}</ul>
//             </Collapse>
//           </li>
//         );
//       }
//       return (
//         <li className={this.activeRoute(prop.layout + prop.path)} key={key}>
//           <NavLink to={prop.layout + prop.path} activeClassName=''>
//             {prop.icon !== undefined ? (
//               <>
//                 <i className={prop.icon} />
//                 <p>{prop.name}</p>
//               </>
//             ) : (
//               <>
//                 <span className='sidebar-mini-icon'>{prop.mini}</span>
//                 <span className='sidebar-normal'>{prop.name}</span>
//               </>
//             )}
//           </NavLink>
//         </li>
//       );
//     });
//   };
// };

// export default Sidebar;

import React from 'react'

const Sidebar = () => <React.Fragment />

export default Sidebar

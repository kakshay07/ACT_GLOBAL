import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";
import profileImg from "../../../public/profile.png";
import { GetEntity, requestHandler } from "../../utils/api";
import { toastError } from "../../utils/SweetAlert";
import { useEffect, useState } from "react";
import { entityModel } from "../../pages/Entity";
import { axios, baseURL } from "../../utils/axios";

// import { SearchInput } from "../Input/Input";

const navLinks = [
  {
    group: "SA Masters",
    url: "/",
    links: [
      { name: "Entity", url: "/entity" , icon : 'fa-solid fa-building'},
      { name: "Pages", url: "/pages" , icon : 'fa-regular fa-copy'},
      { name: "Branch", url: "/branch" , icon : 'fa-solid fa-sitemap'},

    ],
    icon : 'fa-solid fa-user-lock'
  },
  {
    group: "Masters",
    url: "/",
    links: [
      { name: "Roles", url: "/roles" , icon : 'fa-solid fa-universal-access'},
      { name: "Designation", url: "/designation" , icon : 'fa-solid fa-user-tie'},
      { name: "Users", url: "/users" , icon : 'fa-solid fa-users'},
    ],
    icon : 'fa-solid fa-database'
  },
  {
    group: "Global Masters",
    url: "/",
    links: [
      { name: "Pincode Master", url: "/pincodemaster" , icon : 'fa-brands fa-pinterest-p'},
      {name: 'Country Master' ,url:'/country' , icon :'fa-solid fa-globe'},
      {name: 'State Master' ,url:'/state' , icon :'fa-solid fa-flag-usa'},
      {name: 'City Master' ,url:'/city' , icon :'fa-solid fa-city'},
      {name: 'Bank Master' ,url:'/bank' , icon :'fa-solid fa-money-bill'},



     
    ],
    icon : 'fa-solid fa-database'
  },
];

function Nav() {
  const {
    user,
    signout,
    pageAccess,
    branchAccess,
    currentBranch,
    setcurrentBranch,
    currentEntity,
    setccurrentEntity,
    // handleRerender
  } = useAuth();
  const navigate = useNavigate();
  const [entities, setentities] = useState<entityModel[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  function getAllEntity() {
    return requestHandler(
      async () => {
        return await GetEntity();
      },
      (data) => {
        setentities(data.data);
      },
      (errorMessage) => {
        toastError.fire({ title: errorMessage });
      }
    );
  }

  useEffect(() => {
    getAllEntity();
  }, []);

  const hasAccess = (url:string) => {
    // Check if the main link url matches
    if (pageAccess.some((page:any) => page.url === url)) {
        return true;
    }
    for (const page of pageAccess) {
        for (const link of navLinks) {
            if (link.url === url) {
                if (link.links.some((subLinks) => subLinks.url === page.url)) {
                    return true;
                }
            }
        }
    }

    return false;
};

  if (!user) {
    // return <p>You are not logged in.</p>;
    return;
  }

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = () => {
    setMenuOpen(false); 
  };

  const checkboxes = document.querySelectorAll(".showDrop") as NodeListOf<HTMLInputElement>;
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  return (
    <>
      <header className="mainHeader">
        <div className="left">
          <Link className="logo flex items-center" to="">
            <img  src={import.meta.env.VITE_BACKEND_URL + `/uploads/${currentEntity}/logo_nav.png`} alt="" />
            <h1 className="font-semibold text-2xl ml-4">GLOBAL-MASTERS</h1>
          </Link>
        </div>
        <div className="right flex justify-end">
          {/* <PageSearchComponent pages={pageAccess?.map(_=>(_.url))} /> */}
            <>
              {user.is_superadmin ? (
                <div className="flex flex-row relative items-center mr-3">
                  <select
                    title="Entity"
                    value={currentEntity ? currentEntity : ""}
                    onChange={(e) => {
                      setccurrentEntity(Number(e.target.value));
                    }}
                    className="appearance-none rounded pl-3 pr-16 h-full bg-slate-700 text-gray-400"
                  >
                    <option value="">Select Entity</option>
                    {entities.map((entity, index) => (
                      <option key={index} value={entity.entity_id?.toString()}>
                        {entity.name}
                      </option>
                    ))}
                  </select>
                  <i className="fa-solid fa-building text-gray-500 absolute text-2xl right-3"></i>
                </div>
              ) : (
                ""
              )}
              <div className="flex flex-row relative items-center mobile-branch-selector">
                <select
                  title="Branch"
                  value={(currentBranch && currentBranch.branch_id) ? currentBranch.branch_id : ""}
                  onChange={(e) => {
                    setcurrentBranch({
                      branch_id : Number(e.currentTarget.value),
                      branch_name : branchAccess.filter(b => Number(b.branch_id) == Number(e.currentTarget.value))[0].name
                    });
                  }}
                  disabled={!!user.is_staff}
                  className="appearance-none rounded pl-3 pr-16 h-full bg-slate-700 text-gray-400"
                >
                  <option value="">Select Branch</option>
                  {branchAccess.map((branch, index) => (
                    <option key={index} value={branch.branch_id?.toString()}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <i className="fa-solid fa-sitemap text-gray-500 absolute text-2xl right-3"></i>
              </div>

              <div className="border mx-5 border-gray-600"></div>
            </>

          <div className="profile_wrapper">
            <div className="profile_picture">
              <img src={profileImg} alt="" />
            </div>
            <div className="name_wrapper">
              <div className="name flex items-center flex-wrap">
                <div className="w-full text-start pl-1">{user.user_name} </div>
                <p className="flex items-center text-[9px] font-light px-1 py-0 rounded-full text-blue-300 border border-blue-300 h-[15px] mt-1">
                  {user.role_name}
                </p>
              </div>
            </div>
            <div className="dropDownToggle">
              <i className="fa-solid fa-angle-down"></i>
              <ul className="profileDropdownMenu">
                <li>
                  <Link className="link" to="/changePassword">
                    <i className="fa-solid fa-key mr-3"></i>
                    Change Password
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      axios
                      .post(baseURL+'/user/logout', { user_name: user.user_name,entity_id:user.entity_id })
                      .then((response) => {
                        if (response.status === 200) {
                          // alert('Logout successful');
                          signout(() => navigate("/login"));
                        } else {
                          alert('Logout failed');
                        }
                      })
                      .catch((err) => {
                        alert(`Logout failed: ${err.message}`);
                      });
                    }}
                    className="link"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <nav>
        <div className="main_wrapper">
          <div className="wrapper">
            <div className="logo">
              <h1 className="font-semibold text-2xl text-blue-500">ACT-GLOBAL</h1>
            </div>
            <div className="mx-auto block md:hidden w-[177px]" >
            </div>
            <input title="z" type="radio" name="slider" id="menu-btn" checked={menuOpen} // Bind to menuOpen state
              onChange={handleMenuToggle}/>
            <input title="z" type="radio" name="slider" id="close-btn" checked={!menuOpen} // Bind to menuOpen state
              onChange={handleMenuToggle}/>

            <ul className="nav-links">
              <label htmlFor="close-btn" className="btn close-btn">
                <i className="fas fa-times"></i>
              </label>

              {navLinks
                .filter((_) =>
                  user.is_superadmin == 1 ? true : _.group != "SA Masters"
                )
                .filter((group) =>
                  group.links.some((subLink) => hasAccess(subLink.url))
                )
                .map((link, index) => (
                  <li key={index}>
                    {hasAccess(link.url) && (
                      <>
                        {link.group && (
                          <Link onClick={(e)=> {e.preventDefault();handleMenuItemClick();}} to={link.url} className="desktop-item">
                            <i className={`${link.icon} mr-2`}></i>
                            {link.group}
                            <i className="fa-solid fa-caret-down"></i>
                          </Link>
                        )}
                        <input
                          type="checkbox"
                          className="showDrop"
                          id={`showDrop${index}`}
                        />
                        <label
                          htmlFor={`showDrop${index}`}
                          className="mobile-item"
                        >
                          {link.group}
                          <i className="fa-solid fa-caret-down"></i>
                        </label>
                        <ul className="drop-menu">
                          {link.links
                            .filter((subLinks) => hasAccess(subLinks.url))
                            .map((subLinks, index2) => (
                              <li key={index2}>
                                {hasAccess(subLinks.url) && (
                                  <Link to={subLinks.url}  onClick={handleMenuItemClick}>
                                    <i className={`${subLinks.icon} mr-4`}></i>
                                    {subLinks.name}
                                  </Link>
                                )}
                              </li>
                            ))}
                        </ul>
                      </>
                    )}
                  </li>
                ))}

              {/* movbile menu for logout */}
              <li>
                <input
                  type="checkbox"
                  className="showDrop"
                  id="showProfileDrop"
                  
                />
                <label htmlFor="showProfileDrop" className="mobile-item" >
                  Profile
                  <i className="fa-solid fa-caret-down"></i>
                </label>
                <ul className="drop-menu profileDropdownMenu">
                  <li>
                    <Link className="link" to="/changePassword" onClick={handleMenuItemClick}>
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        axios
                        .post(baseURL+'/user/logout', { user_name: user.user_name,entity_id:user.entity_id })
                        .then((response) => {
                          if (response.status === 200) {
                            // alert('Logout successful');
                            signout(() => navigate("/login"));
                          } else {
                            alert('Logout failed');
                          }
                        })
                        .catch((err) => {
                          alert(`Logout failed: ${err.message}`);
                        });
                      }}
                      className="link text-red-500 ml-5 "
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
              <li>
                <>
                  {user.is_superadmin ? (
                    <div className="flex flex-row relative items-center mr-3 w-full md:hidden">
                      <select
                        title="Entity"
                        value={currentEntity ? currentEntity : ""}
                        onChange={(e) => {
                          setccurrentEntity(Number(e.target.value));
                        }}
                        className="appearance-none rounded pl-3 pr-16 h-full bg-slate-700 text-gray-400 w-full"
                      >
                        <option value="">Select Entity</option>
                        {entities.map((entity, index) => (
                          <option key={index} value={entity.entity_id?.toString()}>
                            {entity.name}
                          </option>
                        ))}
                      </select>
                      <i className="fa-solid fa-building text-gray-500 absolute text-2xl right-3"></i>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flex flex-row relative items-center mt-3 w-full  md:hidden">
                    <select
                      title="Branch"
                      value={(currentBranch && currentBranch.branch_id) ? currentBranch.branch_id : ""}
                      onChange={(e) => {
                        setcurrentBranch({
                          branch_id : Number(e.currentTarget.value),
                          branch_name : branchAccess.filter(b => Number(b.branch_id) == Number(e.currentTarget.value))[0].name
                        });
                      }}
                      disabled={!!user.is_staff}
                      className="appearance-none rounded pl-3 pr-16 h-full bg-slate-700 text-gray-400 w-full"
                    >
                      <option value="">Select Branch</option>
                      {branchAccess.map((branch, index) => (
                        <option key={index} value={branch.branch_id?.toString()}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                    <i className="fa-solid fa-sitemap text-gray-500 absolute text-2xl right-3"></i>
                  </div>

                </>
              </li>
            </ul>
            <label htmlFor="menu-btn" className="btn menu-btn">
              <i className="fas fa-bars"></i>
            </label>
          </div>
        </div>
      </nav>
    </>
  );
}

// class searchpages {
//   allPages : string[] = [];
//   filteredPages : string[] = [];
// }

// const PageSearchComponent = ({
//   pages
// }: {
//   pages: string[]
// }) => {
//   const [pageData, setPageData] = useState<searchpages>(new searchpages());
//   const [inputData, setinputData] = useState<string>('');
//   const [showDropdown, setshowDropdown] = useState<boolean>(false);
//   const [selectedIndex, setSelectedIndex] = useState<number>(-1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setPageData(prev => ({
//       ...prev,
//       allPages: pages
//     }));
//   }, [pages]);

//   useEffect(() => {
//     const filteredPages = pageData?.allPages?.filter(_ => _.toLowerCase().includes(inputData.toLowerCase()));
//     setPageData(prev => ({
//       ...prev,
//       filteredPages
//     }));
//     setSelectedIndex(-1);
//     setshowDropdown(true);
//   }, [inputData]);

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (!pageData.filteredPages || pageData.filteredPages.length === 0) return;

//     if (e.key === 'ArrowDown') {
//       setSelectedIndex(prevIndex => Math.min(prevIndex + 1, pageData.filteredPages.length - 1));
//     } else if (e.key === 'ArrowUp') {
//       setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
//     } else if (e.key === 'Enter') {
//       if (selectedIndex >= 0 && selectedIndex < pageData.filteredPages.length) {
//         const selectedPage = pageData.filteredPages[selectedIndex];
        
//         setinputData('')
//         setshowDropdown(false);

//         navigate(selectedPage);
//       }
//     }
//   };

//   const handleItemClick = (page: string) => {
//     setinputData('');
//     setshowDropdown(false);

//     setTimeout(() => {
//       navigate(page);
//     }, 100);
//   };

//   return (
//     <div>
//       <form
//         className="relative mr-1"
//         onSubmit={(e) => {
//           e.preventDefault();
//         }}
//         noValidate
//       >
//         <SearchInput
//           styleClass=" !my-0 bg-transparent [&>input]:bg-gray-700 [&>input]:border-gray-700 [&>input]:text-gray-300"
//           placeholder="Search page"
//           value={inputData}
//           onChange={(e) => {
//             setinputData(e.target.value);
//           }}
//           name="inputData"
//           onFocus={() => {
//             setshowDropdown(true);
//           }}
//           onBlur={() => {
//             setTimeout(() => setshowDropdown(false), 200);
//           }}
//           onKeyDown={(e) => handleKeyDown(e)}
//           autoComplete="off"
//           ShowButton={false}
//         />
//         {
//           (showDropdown && inputData) &&
//           <ul className="absolute bg-white w-[95%] m-2 p-2 rounded z-50 shadow-md max-h-[350px] overflow-y-auto">
//             {
//               pageData.filteredPages.length < 1 ?
//                 <li className="text-sm border-b text-start py-3 px-2 hover:bg-gray-100 cursor-pointer text-gray-500">
//                   No pages found
//                 </li> :
//                 pageData.filteredPages.map((_, index) => (
//                   <li
//                     key={_}
//                     className={`text-sm border-b text-start py-3 px-2 hover:bg-gray-100 cursor-pointer ${selectedIndex === index ? 'bg-gray-200' : ''}`}
//                     onMouseDown={() => handleItemClick(_)}
//                   >
//                     {_}
//                   </li>
//                 ))
//             }
//           </ul>
//         }
//       </form>
//     </div>
//   );
// };





export default Nav;

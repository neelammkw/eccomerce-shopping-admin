// Imports should be at the top level
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { createContext, useState, useEffect, useContext } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import ProductEdit from "./pages/ProductEdit";
import ProductUpload from "./pages/ProductUpload";
import CategoryAdd from "./pages/CategoryAdd";
import SubCategoryAdd from "./pages/SubCategoryAdd";
import SubCategory from "./pages/SubCategory";
import ProductList from "./pages/ProductList";
import OrderDetails from "./pages/OrderDetails";
import Messages from "./pages/Messages";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import Orders from "./pages/Orders";
import SearchResults from "./pages/Search";
import MyAccount from "./pages/MyAccount";
import Notifications from "./pages/Notifications";
import NotificationsList from "./pages/NotificationsList";
import { SnackbarProvider, useSnackbar } from "notistack";
import LoadingBar from "react-top-loading-bar";
import { fetchDataFromApi } from "./utils/api";

// Create Contexts at the top level
export const MyContext = createContext();
export const OrdersContext = createContext();
export const NotificationsContext = createContext();

function App() {
  // NotificationsProvider component
  const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const fetchNotifications = async () => {
      try {
        const res = await fetchDataFromApi(`/api/notifications`);
       
         const unreadNotifications = res.filter(notification => notification.status === "unread");

        setNotifications(unreadNotifications);

        // Calculate the count of unread notifications
        setUnreadNotificationsCount(unreadNotifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    useEffect(() => {
      fetchNotifications();
    }, []);

    // Poll every 10 seconds for notifications (optional)
    useEffect(() => {
      const intervalId = setInterval(fetchNotifications, 10000);
      return () => clearInterval(intervalId); // Clear on unmount
    }, []);

    return (
      <NotificationsContext.Provider
        value={{
          notifications,
          unreadNotificationsCount,
          setNotifications,
          setUnreadNotificationsCount,
        }}
      >
        {children}
      </NotificationsContext.Provider>
    );
  };

  // OrdersProvider component
  const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [orderStats, setOrderStats] = useState({
      pending: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    });

    const [isToggleSidebar, setIsToggleSidebar] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [isHideSideandHeader, setHideSideandHeader] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [themeMode, setThemeMode] = useState(true);
    const [progress, setProgress] = useState(0);
    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });

    const updateOrderStats = (orders) => {
      const pending = orders.filter(
        (order) => order.orderStatus === "pending"
      ).length;
      const shipped = orders.filter(
        (order) => order.orderStatus === "shipped"
      ).length;
      const delivered = orders.filter(
        (order) => order.orderStatus === "delivered"
      ).length;
      const cancelled = orders.filter(
        (order) => order.orderStatus === "cancelled"
      ).length;

      setOrderStats({ pending, shipped, delivered, cancelled });
    };

    useEffect(() => {
      if (themeMode === true) {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        localStorage.setItem("themeMode", "light");
      } else {
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        localStorage.setItem("themeMode", "dark");
      }
    }, [themeMode]);

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token !== null && token !== "" && token !== undefined) {
        setIsLogin(true);
        const userData = JSON.parse(localStorage.getItem("user"));
        setUser(userData);
      } else {
        setIsLogin(false);
      }
    }, [isLogin]);

    const handleClickVariant = (variant) => () => {
      enqueueSnackbar("This is a success message!.", { variant });
    };

    const values = {
      isToggleSidebar,
      setIsToggleSidebar,
      setIsLogin,
      isLogin,
      isHideSideandHeader,
      setHideSideandHeader,
      themeMode,
      setThemeMode,
      handleClickVariant,
      setProgress,
      user,
      setUser,
    };

    return (
      <BrowserRouter>
        <OrdersContext.Provider
          value={{ orders, setOrders, orderStats, updateOrderStats }}
        >
          <NotificationsProvider>
            <MyContext.Provider value={values}>
              <LoadingBar
                color="#f11946"
                progress={progress}
                onLoaderFinished={() => setProgress(0)}
                className="topLoadingbar"
              />
              <SnackbarProvider maxSnack={3}>
                <Layout>
                  <Routes>
                    <Route path="/" exact element={<Dashboard />} />
                    <Route path="/dashboard" exact element={<Dashboard />} />
                    <Route path="/login" exact element={<Login />} />
                    <Route path="/sign-up" exact element={<SignUp />} />
                    <Route
                      path="/product-upload"
                      exact
                      element={<ProductUpload />}
                    />
                    <Route
                      path="/product-details/:id"
                      exact
                      element={<ProductDetails />}
                    />
                    <Route
                      path="/product-edit/:id"
                      exact
                      element={<ProductEdit />}
                    />
                    <Route
                      path="/product-list"
                      exact
                      element={<ProductList />}
                    />
                    <Route
                      path="/category-add"
                      exact
                      element={<CategoryAdd />}
                    />
                    <Route path="/category-list" exact element={<Category />} />
                    <Route
                      path="/subcategory-list"
                      exact
                      element={<SubCategory />}
                    />
                    <Route
                      path="/subcategory-add"
                      exact
                      element={<SubCategoryAdd />}
                    />
                    <Route path="/orders" exact element={<Orders />} />
                    <Route
                      path="/order-details/:orderId"
                      exact
                      element={<OrderDetails />}
                    />
                    <Route path="/reviews" exact element={<Messages />} />
                    <Route path="/my-account" exact element={<MyAccount />} />
                    <Route path="/users" exact element={<Users />} />
                    <Route
                      path="/user-details/:userId"
                      exact
                      element={<UserDetails />}
                    />
                    <Route path="/search" exact element={<SearchResults />} />
                    <Route
                      path="/notifications-details/:Id"
                      exact
                      element={<Notifications />}
                    />
                    <Route
                      path="/notifications-List"
                      exact
                      element={<NotificationsList />}
                    />
                  </Routes>
                </Layout>
              </SnackbarProvider>
            </MyContext.Provider>
          </NotificationsProvider>
        </OrdersContext.Provider>
      </BrowserRouter>
    );
  };

  function Layout({ children }) {
    const location = useLocation();
    const { isToggleSidebar, setHideSideandHeader, isHideSideandHeader } =
      useContext(MyContext);

    useEffect(() => {
      if (location.pathname === "/login" || location.pathname === "/sign-up") {
        setHideSideandHeader(true);
      } else {
        setHideSideandHeader(false);
      }
    }, [location, setHideSideandHeader]);

    return (
      <>
        {!isHideSideandHeader && <Header />}
        <div className="main d-flex">
          {!isHideSideandHeader && (
            <div
              className={`sidebarWrapper ${isToggleSidebar ? "toggle" : ""}`}
            >
              <Sidebar />
            </div>
          )}
          <div
            className={`content ${isHideSideandHeader ? "full" : ""} ${
              isToggleSidebar ? "toggle" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </>
    );
  }

  return <OrdersProvider />;
}

export default App;

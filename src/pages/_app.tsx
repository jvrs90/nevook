import { ApolloProvider } from "@apollo/client";
import Header from "@Components/menu/header";
import { toastSettings } from "@Config/toast.settings";
import { ThemeEnum } from "@Enums/config/theme.enum";
import { GSSProps } from "@Interfaces/props/gss-props.interface";
import { AuthContext } from "@Lib/context/auth.context";
import { BrowserContext } from "@Lib/context/resolution.context";
import { useAuthAndApollo } from "@Lib/hook/useAuthAndApollo";
import { useBrowserPreferences } from "@Lib/hook/useBrowserPreferences";
import { useServiceWorker } from "@Lib/hook/useServiceWorker";
import "@Styles/index.css";
import dynamic from "next/dynamic";
import { ComponentType, FC } from "react";
import { ToastContainer } from "react-toastify";

const MenuMobile = dynamic(() => import("@Components/menu/menu-mobile"), {
  ssr: false,
});

/**
 * Interface for custom implementation of NextJS App props.
 */
interface CustomAppProps {
  Component: ComponentType;
  pageProps: GSSProps;
}

/**
 * Application entry point component.
 * @param props.Component Component to render
 * @param props.pageProps Props obtained through getServerSideProps
 */
const App: FC<CustomAppProps> = ({ Component, pageProps }) => {
  const { authProps, lostAuth, componentProps } = pageProps;

  const { browserPreferences, toggleDarkMode } = useBrowserPreferences(
    componentProps ? (componentProps.theme as ThemeEnum) : ThemeEnum.LIGHT
  );

  const { apolloClient, setAuth, stateAuth } = useAuthAndApollo(
    authProps,
    lostAuth
  );

  useServiceWorker(process.env.NEXT_PUBLIC_SERVICE_WORKER_SERVER_PATH || "");

  return (
    <>
      <AuthContext.Provider value={{ stateAuth, setAuth }}>
        <ApolloProvider client={apolloClient}>
          <BrowserContext.Provider
            value={{
              browserPreferences,
              toggleDarkMode,
            }}
          >
            {browserPreferences.isMobile && <MenuMobile />}
            <div
              className="page bg-secondary dark:bg-gray-900"
              id="menuMobContent"
            >
              <Header user={stateAuth?.user} />
              <div className="page-content">
                <Component {...componentProps} />
              </div>
            </div>
          </BrowserContext.Provider>
        </ApolloProvider>
      </AuthContext.Provider>
      <ToastContainer {...toastSettings} />
    </>
  );
};

export default App;

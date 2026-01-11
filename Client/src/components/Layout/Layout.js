import { createContext, useContext, useEffect, useState } from "react"
import MobileLayout from "../../Layout Structures/MobileLayout"
import DesktopLayout from "../../Layout Structures/DesktopLayout"

const GlobalScreenWidth = createContext();

function Layout(){
    const [mobileScreen,setMobileScreen]= useState(window.innerWidth<600)
    
    useEffect(()=>{
        function handleResize(){
            if(window.innerWidth<600){
                setMobileScreen(true)
            }
            else{
                setMobileScreen(false)
            }
        }

        window.addEventListener("resize",handleResize)
    },[window.innerWidth])
    return <>
        {
            (mobileScreen) ?
                <GlobalScreenWidth.Provider value={{mobileScreen:mobileScreen,desktopScreen:(!mobileScreen)}}>
                    <MobileLayout/> 
                </GlobalScreenWidth.Provider>
            : 
            <GlobalScreenWidth.Provider value={{mobileScreen:mobileScreen,desktopScreen:(!mobileScreen)}}>
                <DesktopLayout/>
            </GlobalScreenWidth.Provider>
        }
    </>
}

const useScreenData=()=>{
    return useContext(GlobalScreenWidth)
}

export {Layout,useScreenData}
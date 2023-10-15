import {Outlet} from "react-router-dom";
import Header from './components/common/Header'
import {createContext, useState} from "react";

export const ModeContext = createContext({
    theme: 'light',
    setTheme: (theme: string) => {
    }
})

const Root = () => {

    const mode = localStorage.getItem('mode') === 'dark' ? 'dark' : ''
    const [theme, setTheme] = useState<string>(mode);

    // @ts-ignore
    return (
        <div className='container'>
            <ModeContext.Provider value={{theme, setTheme}}>
                <Header/>
                <Outlet/>
            </ModeContext.Provider>

        </div>
    )
};

export default Root;
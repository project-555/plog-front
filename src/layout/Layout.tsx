import Header from '../components/common/Header'

const Layout = (children: React.ReactNode) => {
    return (
        <div>
            <Header/>
            <main>
                {children}
            </main>
        </div>
    )
};

export default Layout;
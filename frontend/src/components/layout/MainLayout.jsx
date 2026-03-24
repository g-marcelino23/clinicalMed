import Sidebar from './Sidebar'

function MainLayout({ children }) {
  return (
    <div className="d-flex">
      <Sidebar />
      <main
        className="flex-grow-1 p-4 bg-light"
        style={{ minHeight: '100vh' }}
      >
        {children}
      </main>
    </div>
  )
}

export default MainLayout
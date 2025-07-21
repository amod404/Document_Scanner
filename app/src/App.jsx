import './App.css'
import Navbar from './components/navbar'
import ImageProcessor from './components/imageProcessor'

function App() {

  return (
    <div className='flex w-screen min-h-screen flex-col bg-blue-50'>
      <Navbar/>
      <div className='h-full'>
        <div>
          <ImageProcessor/>
        </div>
      </div>
    </div>
  )
}

export default App

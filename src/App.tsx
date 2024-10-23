import { useState } from 'react'
import './App.css'
import CVUploadForm from './components/CVUploadForm'
import DownloadCoverLetter from './components/DownloadCoverLetter'
import { ArrowLeft, Mail, FileText } from 'lucide-react' // Import icons

function App() {
  const [email, setEmail] = useState('')
  const [currentPage, setCurrentPage] = useState('home')
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('')

  const goBack = () => {
    switch (currentPage) {
      case 'upload':
        setCurrentPage('home');
        break;
      case 'download':
        setCurrentPage('upload');
        break;
      default:
        break;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div className="text-center">
              <h2 className="text-4xl font-extrabold sm:text-5xl md:text-6xl flex items-center justify-center">
                <FileText className="mr-4" /> Craft Your Perfect Cover Letter
              </h2>
              <p className="mt-3 max-w-md mx-auto text-xl text-muted-foreground sm:text-2xl md:mt-5 md:max-w-3xl">
                Stand out from the crowd with professionally generated cover letters tailored to your industry and experience.
              </p>
              <div className="mt-10 sm:flex sm:justify-center">
                <div className="rounded-md shadow">
                  <button onClick={() => setCurrentPage('upload')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-background bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10">
                    Get Started
                  </button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-secondary hover:bg-secondary/90 md:py-4 md:text-lg md:px-10">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-40">
              <h3 className="text-2xl font-semibold text-center mb-8 flex items-center justify-center">
                <Mail className="mr-2" /> Join Our Newsletter
              </h3>
              <form className="max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
                <div className="flex items-center border-b border-primary py-2">
                  <input 
                    className="appearance-none bg-transparent border-none w-full text-foreground mr-3 py-1 px-2 leading-tight focus:outline-none" 
                    type="email" 
                    placeholder="Enter your email" 
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button 
                    className="flex-shrink-0 bg-primary hover:bg-primary/90 border-primary hover:border-primary/90 text-sm border-4 text-primary-foreground py-1 px-2 rounded" 
                    type="submit"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </>
        );
      case 'upload':
        return (
          <>
            <button onClick={goBack} className="mb-4 flex items-center text-white text-primary hover:text-white">
              <ArrowLeft className="h-6 w-6 mr-2" />
              Go Back
            </button>
            <CVUploadForm 
              onSubmit={(coverLetter) => {
                setGeneratedCoverLetter(coverLetter);
                setCurrentPage('download');
              }} 
            />
          </>
        );
      case 'download':
        return (
          <>
            <button onClick={goBack} className="mb-4 flex items-center text-primary text-white hover:bg-gray-500">
              <ArrowLeft className="h-6 w-6 mr-2" />
              Go Back
            </button>
            <DownloadCoverLetter coverLetter={generatedCoverLetter} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <nav className="flex  items-center">
          <h1 className="text-2xl justify-start font-bold text-primary">CoverCraft</h1>
          {/* <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Sign In
          </button> */}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {renderPage()}
      </main>

      <footer className="bg-secondary mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">
            © 2024 CoverCraft. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

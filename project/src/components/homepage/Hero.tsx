import RotatingWords from '../RotatingWords'
import { Search } from 'lucide-react';

function Hero() {
  const heroTextOptions = ["reading", "writing", "sharing"];

  return (
    <section className="hero border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Stories worth {" "}
              <RotatingWords words={heroTextOptions} className='text-primary' />
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover insights, tutorials, and thoughts from developers and creators around the world.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero
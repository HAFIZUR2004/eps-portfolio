<div className="w-full lg:w-1/2 relative flex flex-col items-center">
            {/* Main Image with Green Frame */}
            <div className="relative w-full max-w-xl">
              <div className="absolute -top-3 -right-3 w-full h-full border-[2px] border-[#2e7d32] rounded-xl z-0 bg-transparent pointer-events-none hidden sm:block"></div>
              
              <div className="relative z-10 bg-white p-2 rounded-xl shadow-xl w-full overflow-hidden border border-gray-200">
                <div className="w-full aspect-[4/3] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={slides[currentSlide].img}
                        alt={slides[currentSlide].title}
                        fill
                        className="object-contain rounded"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Thumbnails & Controls (Fixed Layout) */}
            <div className="mt-5 w-full max-w-xl flex justify-between items-center bg-[#e2dcd3] px-4 py-2.5 rounded-md shadow-inner">
              
              {/* Prev Button */}
              <button onClick={prevSlide} className="text-gray-600 hover:text-black transition p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Thumbnails */}
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    className={`relative w-12 h-9 rounded border transition-all duration-200 overflow-hidden ${
                      index === currentSlide 
                        ? 'border-[#ff5722] opacity-100 scale-105 shadow-md ring-1 ring-[#ff5722]' 
                        : 'border-gray-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={slide.img} alt={`Thumb ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button onClick={nextSlide} className="text-gray-600 hover:text-black transition p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Counter (Fixed Dynamic Values) */}
              <div className="flex items-center text-xs font-mono text-gray-700 font-semibold gap-1 bg-white/60 px-2 py-1 rounded">
                 <span>{`0${currentSlide + 1}`}</span>
                 <span className="text-gray-400">/</span>
                 <span className="text-gray-400">{`0${slides.length}`}</span>
              </div>

            </div>
            
          </div>
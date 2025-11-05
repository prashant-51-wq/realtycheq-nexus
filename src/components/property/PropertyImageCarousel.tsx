import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface PropertyImageCarouselProps {
  images: string[];
  title: string;
  className?: string;
}

export function PropertyImageCarousel({ images, title, className = '' }: PropertyImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImageIndex] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop';

  return (
    <>
      <div className={`relative group ${className}`}>
        <img
          src={currentImage}
          alt={title}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setShowFullscreen(true)}
        />
        
        {images.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
              {images.length > 5 && (
                <span className="text-white text-xs ml-2">+{images.length - 5} more</span>
              )}
            </div>
            
            {/* Image Counter */}
            <div className="absolute top-4 right-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={showFullscreen} onOpenChange={setShowFullscreen}>
        <DialogContent className="max-w-screen-xl w-full h-full p-0 bg-black/95">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setShowFullscreen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/70"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
            
            <img
              src={currentImage}
              alt={title}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Fullscreen Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentImageIndex === index ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
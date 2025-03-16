import React, { CSSProperties, useState } from 'react';
import { RotateCw, Upload, Download, Info, Check, ChevronDown, Camera, Zap, FlipHorizontal } from 'lucide-react';
import useImageEditor from '../hooks/useImageEditor';

interface ImageEditorProps {
  templateSrc: string;
  onExport?: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ templateSrc, onExport }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  
  const {
    canvasRef,
    containerRef,
    uploadedImage,
    handleDragStart,
    handleRotateStart,
    handleResizeStart,
    handleMouseMove,
    handleTouchMove,
    handleImageUpload,
    exportImage,
    getControlPoints,
    handleFlip,
  } = useImageEditor(templateSrc);

  const handleExport = () => {
    exportImage();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
    if (onExport) {
      onExport();
    }
  };

  return (
    <div className="image-editor">
      {/* Main title */}
      <div className="mb-5 text-center">
        <h2 className="text-xl font-bold mb-2">Create Your Mubarak Avatar</h2>
        <p className="text-sm text-black/70">
          Upload your photo, adjust size and position to create your personalized avatar
        </p>
      </div>
      
      {/* Main content - horizontal layout with improved styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Image editing area */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-green-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          
          {/* Main canvas container */}
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="relative w-full max-w-[500px] mx-auto object-contain rounded-xl shadow-xl"
            />
            
            {/* Image editing controls */}
            {uploadedImage && (
              <div 
                ref={containerRef}
                className="absolute inset-0 touch-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
              >
                {/* Image control frame */}
                <div 
                  className="absolute origin-center pointer-events-none"
                  style={getControlPoints() as CSSProperties}
                >
                  {/* Center drag area */}
                  <div 
                    className="absolute inset-0 cursor-move pointer-events-auto"
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                  />
                  
                  {/* Corner resize controls */}
                  <div 
                    className="absolute -top-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white cursor-nwse-resize shadow-md pointer-events-auto z-20"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                  />
                  <div 
                    className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white cursor-nesw-resize shadow-md pointer-events-auto z-20"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                  />
                  <div 
                    className="absolute -bottom-2 -left-2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white cursor-nesw-resize shadow-md pointer-events-auto z-20"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                  />
                  <div 
                    className="absolute -bottom-2 -right-2 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white cursor-nwse-resize shadow-md pointer-events-auto z-20"
                    onMouseDown={handleResizeStart}
                    onTouchStart={handleResizeStart}
                  />
                  
                  {/* Rotation control */}
                  <div 
                    className="absolute -top-9 left-1/2 transform -translate-x-1/2 flex gap-2"
                  >
                    <div 
                      className="w-7 h-7 bg-black rounded-full border-2 border-white flex items-center justify-center cursor-grab shadow-lg pointer-events-auto z-20"
                      onMouseDown={handleRotateStart}
                      onTouchStart={handleRotateStart}
                    >
                      <RotateCw className="w-4 h-4 text-white" />
                    </div>
                    <div 
                      className="w-7 h-7 bg-black rounded-full border-2 border-white flex items-center justify-center cursor-pointer shadow-lg pointer-events-auto z-20"
                      onClick={handleFlip}
                    >
                      <FlipHorizontal className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {/* Control frame border */}
                  <div className="absolute inset-0 border-2 border-dashed border-white rounded-md"></div>
                </div>

                {/* Operation hints */}
                {/* <div className="pointer-events-none select-none">
                  <p className="w-[300px] text-xs text-white bg-black/50 px-2 py-1 rounded-lg absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    Drag center to move | Corner points to resize | Top button to rotate
                  </p>
                </div> */}
              </div>
            )}
            
            {/* Placeholder when no image is uploaded */}
            {!uploadedImage && (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-black/20 rounded-xl">
                <p className="text-white font-bold text-xl">Upload Your Photo</p>
                <p className="text-white/80 text-sm max-w-[70%] text-center">Merge your photo with the Mubarak template</p>
                <label className="flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl cursor-pointer hover:bg-white transition-colors font-bold">
                  <Upload className="w-5 h-5" />
                  <span>Select Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls and tutorial with improved styling */}
        <div className="flex flex-col gap-4">
          {/* Action cards in a sleeker design */}
          <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-yellow-100">
            <div className="flex flex-col gap-5">
              {/* Title */}
              <div className="flex items-center gap-2">
                <div className="bg-yellow-400/90 p-2 rounded-xl">
                  <Camera className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-medium">Photo Editor</h3>
              </div>
              
              {/* Divider */}
              <div className="h-px bg-yellow-100"></div>
              
              {/* Upload control */}
              <div>
                <p className="text-xs text-black/60 mb-2 font-medium">Upload a photo to get started</p>
                <label className="flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-xl cursor-pointer hover:bg-yellow-50 transition-colors border border-yellow-200">
                  <Upload className="w-4 h-4" />
                  <span>Select Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {/* Export control */}
              <div>
                <p className="text-xs text-black/60 mb-2 font-medium">When finished, save your creation</p>
                <button 
                  onClick={handleExport}
                  className={`flex items-center justify-center gap-2 w-full ${exportSuccess ? 'bg-green-500 text-white' : 'bg-yellow-400 text-black'} px-4 py-3 rounded-xl hover:shadow-md transition-all ${!uploadedImage ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[-2px]'}`}
                  disabled={!uploadedImage}
                >
                  {exportSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Export Successful!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Export Avatar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Tips card */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm border border-yellow-100">
            <button 
              onClick={() => setShowTutorial(!showTutorial)}
              className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium hover:bg-yellow-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="bg-yellow-100 p-1.5 rounded-lg">
                  <Zap className="w-3.5 h-3.5 text-yellow-600" />
                </div>
                <span>Tips & Tricks</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-yellow-500 transition-transform ${showTutorial ? 'rotate-180' : ''}`} />
            </button>
            
            {showTutorial && (
              <div className="px-5 pt-0 pb-4 text-sm text-black/70">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Upload your favorite photo (square or near-square images work best)</li>
                  <li>Drag to adjust position for perfect integration with the template</li>
                  <li>Use corner control points to resize your photo</li>
                  <li>Use the top rotation control to adjust the angle</li>
                  <li>When finished, click "Export Avatar" to save your creation</li>
                  <li>Share your creation on social media and tag us!</li>
                </ol>
              </div>
            )}
          </div>
          
          {/* Image info */}
          <div className="bg-black/5 rounded-xl p-3 text-xs text-black/60">
            <p className="flex items-center justify-center gap-2">
              <Info className="w-3 h-3" />
              <span>Your image will be processed locally - nothing is uploaded to our servers</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditor; 
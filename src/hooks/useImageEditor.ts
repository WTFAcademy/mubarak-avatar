import { useState, useRef, useEffect } from 'react';

export interface ImageTransform {
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
}

export interface ImageEditorHook {
  imageRef: React.RefObject<HTMLImageElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  uploadedImage: string | null;
  transform: ImageTransform;
  isDragging: boolean;
  isRotating: boolean;
  isResizing: boolean;
  startPoint: { x: number; y: number; scale: number; rotation: number };
  handleDragStart: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  handleRotateStart: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  handleResizeStart: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exportImage: () => void;
  getControlPoints: () => {width?: string, height?: string, transform?: string};
  drawImageOnCanvas: () => void;
}

export default function useImageEditor(templateSrc: string): ImageEditorHook {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const templateImageRef = useRef<HTMLImageElement | null>(null);
  
  const [transform, setTransform] = useState<ImageTransform>({ scale: 1, positionX: 0, positionY: 0, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0, scale: 1, rotation: 0 });

  // 处理图片拖拽
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    if ('clientX' in e) {
      setStartPoint({ ...startPoint, x: e.clientX, y: e.clientY });
    } else if (e.touches.length === 1) {
      setStartPoint({ ...startPoint, x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  // 处理图片旋转
  const handleRotateStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsRotating(true);
    
    // 记录初始旋转角度
    setStartPoint({ ...startPoint, rotation: transform.rotation });
    
    if ('clientX' in e) {
      setStartPoint(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    } else if (e.touches.length === 1) {
      setStartPoint(prev => ({ ...prev, x: e.touches[0].clientX, y: e.touches[0].clientY }));
    }
  };

  // 处理图片缩放
  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);
    
    setStartPoint({ ...startPoint, scale: transform.scale });
    
    if ('clientX' in e) {
      setStartPoint(prev => ({ ...prev, x: e.clientX, y: e.clientY }));
    } else if (e.touches.length === 1) {
      setStartPoint(prev => ({ ...prev, x: e.touches[0].clientX, y: e.touches[0].clientY }));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      // 处理拖拽
      const deltaX = clientX - startPoint.x;
      const deltaY = clientY - startPoint.y;
      
      setTransform(prev => ({
        ...prev,
        positionX: prev.positionX + deltaX,
        positionY: prev.positionY + deltaY
      }));
      
      setStartPoint(prev => ({ ...prev, x: clientX, y: clientY }));
    } 
    else if (isRotating) {
      // 处理旋转
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // 计算角度
      const startAngle = Math.atan2(startPoint.y - centerY, startPoint.x - centerX);
      const currentAngle = Math.atan2(clientY - centerY, clientX - centerX);
      const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
      
      setTransform(prev => ({
        ...prev,
        rotation: (startPoint.rotation + angleDiff) % 360
      }));
    } 
    else if (isResizing) {
      // 处理缩放
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 + transform.positionX;
      const centerY = rect.top + rect.height / 2 + transform.positionY;
      
      // 计算初始距离和当前距离
      const initialDistance = Math.sqrt(
        Math.pow(startPoint.x - centerX, 2) + Math.pow(startPoint.y - centerY, 2)
      );
      
      const currentDistance = Math.sqrt(
        Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2)
      );
      
      // 根据距离变化计算缩放比例
      const scaleFactor = currentDistance / initialDistance;
      const newScale = Math.max(0.1, startPoint.scale * scaleFactor);
      
      setTransform(prev => ({
        ...prev,
        scale: newScale
      }));
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    setIsResizing(false);
  };

  const drawImageOnCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 首先绘制用户上传的图片
    if (uploadedImage && imageRef.current) {
      const img = imageRef.current;
      const targetWidth = canvas.width * 0.3;
      const targetHeight = canvas.height * 0.6;

      // 计算缩放比例以保持宽高比
      const scale = Math.min(
        targetWidth / img.width,
        targetHeight / img.height
      );
      
      const width = img.width * scale * transform.scale;
      const height = img.height * scale * transform.scale;

      // 计算中心位置
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      // 应用变换
      ctx.save();
      ctx.translate(centerX + transform.positionX, centerY + transform.positionY);
      ctx.rotate(transform.rotation * Math.PI / 180);
      ctx.drawImage(img, -width/2, -height/2, width, height);
      ctx.restore();
    }

    // 确保模板图像已加载后再绘制
    if (templateImageRef.current && templateImageRef.current.complete) {
      ctx.save();
      ctx.globalAlpha = 0.9; // 设置透明度
      ctx.drawImage(templateImageRef.current, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 重置变换状态
        setTransform({ scale: 1, positionX: 0, positionY: 0, rotation: 0 });
        
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setUploadedImage(e.target?.result as string);
          drawImageOnCanvas();
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 临时创建一个用于导出的画布
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');
    
    if (!exportCtx) return;

    // 清除画布
    exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);

    // 绘制用户图片（如果有）
    if (uploadedImage && imageRef.current) {
      const img = imageRef.current;
      const targetWidth = canvas.width * 0.3;
      const targetHeight = canvas.height * 0.6;

      // 计算缩放比例以保持宽高比
      const scale = Math.min(
        targetWidth / img.width,
        targetHeight / img.height
      );
      
      const width = img.width * scale * transform.scale;
      const height = img.height * scale * transform.scale;

      // 计算中心位置
      const centerX = canvas.width * 0.5;
      const centerY = canvas.height * 0.5;

      // 应用变换
      exportCtx.save();
      exportCtx.translate(centerX + transform.positionX, centerY + transform.positionY);
      exportCtx.rotate(transform.rotation * Math.PI / 180);
      exportCtx.drawImage(img, -width/2, -height/2, width, height);
      exportCtx.restore();
    }

    // 绘制模板（完全不透明）
    exportCtx.drawImage(templateImageRef.current as HTMLImageElement, 0, 0, exportCanvas.width, exportCanvas.height);

    try {
      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'mubarak-avatar.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
    }
  };

  // 计算控制点位置（编辑模式下的UI叠加层）
  const getControlPoints = () => {
    if (!canvasRef.current || !uploadedImage || !imageRef.current) return {width: '', height: '', transform: ''};
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const img = imageRef.current;
    
    // 计算图片在画布上的显示尺寸
    const targetWidth = canvas.width * 0.3;
    const targetHeight = canvas.height * 0.6;
    const scale = Math.min(
      targetWidth / img.width,
      targetHeight / img.height
    );
    
    const width = img.width * scale * transform.scale;
    const height = img.height * scale * transform.scale;
    
    // 修正位置计算 - 确保和drawImageOnCanvas函数中的计算保持一致
    // 计算位置比例 - 将canvas绘制坐标转换为DOM坐标
    const scaleRatio = rect.width / canvas.width;
    
    // 中心位置 (使用与绘制时相同的计算方式)
    const centerX = (canvas.width * 0.5 * scaleRatio);
    const centerY = (canvas.height * 0.5 * scaleRatio);
    
    // 修正后的变换
    const transformX = transform.positionX * scaleRatio;
    const transformY = transform.positionY * scaleRatio;
    
    // 返回控制点相关样式和属性
    return {
      width: `${width * scaleRatio}px`,
      height: `${height * scaleRatio}px`,
      transform: `translate(calc(${centerX}px + ${transformX}px - 50%), calc(${centerY}px + ${transformY}px - 50%)) rotate(${transform.rotation}deg)`,
    };
  };

  useEffect(() => {
    // 创建并加载模板图像
    const templateImage = new Image();
    templateImage.crossOrigin = "anonymous";
    templateImage.src = templateSrc;
    
    templateImage.onload = () => {
      templateImageRef.current = templateImage;
      drawImageOnCanvas();
    };

    // 添加全局指针事件监听器
    document.addEventListener('mouseup', handlePointerUp);
    document.addEventListener('touchend', handlePointerUp);
    
    return () => {
      document.removeEventListener('mouseup', handlePointerUp);
      document.removeEventListener('touchend', handlePointerUp);
    };
  }, [templateSrc]); // 仅在 templateSrc 变化时重新加载模板图像

  useEffect(() => {
    drawImageOnCanvas();
  }, [uploadedImage, transform]);

  return {
    imageRef,
    canvasRef,
    containerRef,
    uploadedImage,
    transform,
    isDragging,
    isRotating,
    isResizing,
    startPoint,
    handleDragStart,
    handleRotateStart,
    handleResizeStart,
    handleMouseMove,
    handleTouchMove,
    handleImageUpload,
    exportImage,
    getControlPoints,
    drawImageOnCanvas
  };
} 
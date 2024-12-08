import Image from 'next/image';
import Heatmap from './Heatmap';

export default function Features() {
  return (
    <div className="relative w-full flex flex-col items-center">
      <div className="flex flex-col bg-gray-500 bg-opacity-30 w-[95%] rounded-3xl items-center py-16 z-20">
        <Heatmap />
      </div>
      <div className="absolute top-96 mt-[450px] left-0">
        
      </div>
      <div className="absolute bottom-0 right-0">
      </div>
    </div>
  );
}

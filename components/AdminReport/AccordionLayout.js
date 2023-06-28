import React from "react";
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";

const AccordionLayout = ({ title, children, show, handleShow, sizeHeight, sizeWidth }) => {

  return (
    <div className="flex flex-col h-fit bg-white/[0.15] rounded-[10px]">
      <div
        onClick={() => handleShow(title)}
        className="flex flex-col justify-start h-[50px] min-h-fit w-[340px] text-[16px] leading-[22px] tracking-[-1px] "
      >
        <div className="flex group cursor-pointer content-center h-full">
          <div className="text-white font-bold text-[20px] flex items-center w-full pl-10 group-hover:text-white">
            {title}
          </div>
          <div className="flex items-center justify-end pr-10">
            {show ? (
              sizeWidth < 768
                ? <FaChevronDown className="w-5 h-5 group-hover:text-white text-white" />
                : <FaChevronRight className="w-5 h-5 group-hover:text-white text-white" />
            ) : (
              sizeWidth < 768
                ? <FaChevronUp className="w-5 h-5 group-hover:text-white text-white" />
                : <FaChevronUp className="w-5 h-5 group-hover:text-white text-white" />
            )}
          </div>
        </div>
      </div>
      {sizeWidth < 768 && show && (
        <div className="flex flex-wrap w-[340px]
                            content-around justify-start p-[20px]
                            rounded-[10px] text-[16px] leading-[22px] tracking-[-1px]">
          {children}
        </div>
      )}
    </div>
  );
};

export default AccordionLayout;
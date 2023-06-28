import React from "react";

const RightLayout = ({ title, children, show, setShow, sizeHeight, sizeWidth }) => {

    if (sizeWidth > 768 && show) {
        return (
            <div className="pb-[20px] pr-[20px]">
                <div className="flex flex-col bg-white/[0.15] rounded-[10px] pb-[20px] pr-[20px]">
                    <div className="flex flex-wrap max-w-[1350px]
                content-around justify-start p-[20px]
                rounded-[10px] text-[16px] leading-[22px] tracking-[-1px]">
                        {children}
                    </div>
                </div>
            </div>
        )

    }

    return (
        <>
        </>
    );
};

export default RightLayout;
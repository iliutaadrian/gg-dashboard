import React from "react";

export const Steps = (props: {}) => {
  return (
    <section id="works" className="relative py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl text-white font-extrabold mx-auto md:text-6xl lg:text-5xl">
            How does it work?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-base text-gray-400 leading-relaxed md:text-2xl">
            Our AI solution will help you from start to finish
          </p>
        </div>
        <div className="relative mt-12 lg:mt-20">
          <div className="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img
              className="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
            />
          </div>
          <div className="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary border-2 rounded-full shadow">
                <span className="text-xl font-semibold ">1</span>
              </div>
              <h3 className="mt-6 text-xl  text-white font-semibold leading-tight md:mt-10">
                Select template
              </h3>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Select template accourding to your requirement
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary border-2  rounded-full shadow">
                <span className="text-xl font-semibold ">2</span>
              </div>
              <h3 className="mt-6 text-xl text-white font-semibold leading-tight md:mt-10">
                Enter Your Details
              </h3>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                Put in your personalized details and let the AI do the rest.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary border-2 rounded-full shadow">
                <span className="text-xl font-semibold ">3</span>
              </div>
              <h3 className="mt-6 text-xl text-white font-semibold leading-tight md:mt-10">
                Publish it
              </h3>
              <p className="mt-4 text-base  md:text-lg text-muted-foreground">
                Use output as you like
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

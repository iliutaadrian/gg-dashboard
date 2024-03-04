import { Rules } from "./rules";

export const Features = () => {
  return (
    <div className=" md:max-w-5xl mx-auto py-10">
      <h1 className="text-2xl md:text-4xl font-bold text-primary text-center">
        Features
      </h1>
      <h1 className="text-xl font-medium text-center">
        Conversations Redefined, Boundaries Unleashed
      </h1>
      <div className="mt-4 px-3 text-sm text-center">
        <Rules />
      </div>
    </div>
  );
};

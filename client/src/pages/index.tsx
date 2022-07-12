import type { NextPage } from "next";
import { Canvas } from "../components/Canvas";

const Home: NextPage = () => {
  return (
    <div className="flex justify-center items-center h-[90vh]">
      <Canvas />
    </div>
  );
};

export default Home;

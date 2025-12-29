const Loading = () => {
  // CLS 방지: h-screen 대신 최소 높이로 변경
  return (
    <div className="flex justify-center items-center py-20 min-h-[500px] text-2xl font-bold text-white">Loading...</div>
  );
};

export default Loading;

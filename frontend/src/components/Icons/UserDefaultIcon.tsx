const UserDefaultIcon = ({
  textContent,
  classNameCustome,
}: {
  textContent: string;
  classNameCustome?: string;
}) => {
  return (
    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" className={classNameCustome}>
      <circle cx="15" cy="15" r="15" fill="#94a3b8" />
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dy=".3em"
        font-size="18"
        fill="white"
        font-family="Arial, sans-serif"
      >
        {textContent}
      </text>
    </svg>
  );
};

export default UserDefaultIcon;

import "./card.css";

const Card = ({ title, translationKey, body }) => {
  const copyToClipboard = () => {
    let textToCopy = `"${body}"`;

    if (translationKey) {
      textToCopy = `"${translationKey}": "${body}"`;
    }

    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <li className="link-card">
      <div className="content" onClick={copyToClipboard}>
        <h2 className="py-1 text-md transition-colors duration-300">
          {title.toUpperCase()}
        </h2>
        {translationKey && (
          <small className="text-gray-400">{translationKey}</small>
        )}
        <p className="py-1">{body}</p>
      </div>
    </li>
  );
};

export default Card;

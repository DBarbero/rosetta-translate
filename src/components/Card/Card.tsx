import "./card.css";

const Card = ({ title, translationKey, body }) => {

  const getBodyString = () => {
    if (typeof body === "string") {
      return body;
    }

    return JSON.stringify(body, null, 2);
  }
  
  const copyToClipboard = () => {
    let textToCopy = `${getBodyString()}`;

    if (translationKey) {
      textToCopy = `"${translationKey}": ${getBodyString()}`;
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
        <p className="py-1">{getBodyString()}</p>
      </div>
    </li>
  );
};

export default Card;

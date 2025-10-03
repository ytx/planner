
const AboutTab = () => {
  return (
    <div className="about-tab">
      <h3>Plannerについて</h3>
      <p>
        このアプリケーションは、日々のタスク管理を支援するために開発されました。
      </p>
      <p>
        GitHubリポジトリ:
        <a href="https://github.com/ytx/planner" target="_blank" rel="noopener noreferrer">
          https://github.com/ytx/planner
        </a>
      </p>
      <p>
        開発者を応援する:
        <a href="https://buymeacoffee.com/xpenguin" target="_blank" rel="noopener noreferrer">
          Buy me a Coffee
        </a>
      </p>
      <div className="bmc-qr-code">
        <img src="/bmc_qr.png" alt="Buy me a Coffee QR Code" style={{ maxWidth: '150px', height: 'auto' }} />
      </div>
    </div>
  );
};

export default AboutTab;

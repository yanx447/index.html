[Index.html.html](https://github.com/user-attachments/files/25156492/Index.html.html)
<!DOCTYPE html><meta name="viewport" content="width=device-width, initial-scale=1.0">
<html lang="ka">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ჩემი სიყვარული 💘</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet">

  <!-- Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #fbc2eb, #a18cd1);
      background-size: 400% 400%;
      animation: bgMove 12s ease infinite;
      font-family: "Poppins", sans-serif;
      overflow: hidden;
    }

    @keyframes bgMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .card {
      width: min(92%, 420px);
      padding: 40px 30px 45px;
      background: rgba(255, 255, 255, 0.75);
      backdrop-filter: blur(18px);
      border-radius: 28px;
      text-align: center;
      box-shadow:
        0 30px 80px rgba(0,0,0,0.25),
        inset 0 0 0 1px rgba(255,255,255,0.4);
      position: relative;
      animation: cardIn 1.1s ease;
    }

    @keyframes cardIn {
      from { opacity: 0; transform: translateY(30px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .card::before {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 30px;
      background: linear-gradient(120deg, #ff4d6d, #ff9a9e, #fbc2eb);
      z-index: -1;
      filter: blur(20px);
      opacity: 0.7;
    }

    .emoji {
      font-size: 68px;
      margin-bottom: 12px;
      animation: heartbeat 1.8s infinite;
    }

    @keyframes heartbeat {
      0%,100% { transform: scale(1); }
      25% { transform: scale(1.08); }
      50% { transform: scale(1); }
      75% { transform: scale(1.12); }
    }

    h2 {
      font-family: "Playfair Display", serif;
      font-size: 28px;
      color: #4a1c2f;
      margin-bottom: 30px;
      line-height: 1.35;
    }

    .buttons {
      position: relative;
      height: auto;
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    button {
      padding: 14px 36px;
      border-radius: 40px;
      border: none;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      position: relative;
    }

    button:active {
      transform: scale(0.94);
    }

    #yes {
      background: linear-gradient(135deg, #ff4d6d, #ff758f);
      color: #fff;
      box-shadow: 0 15px 35px rgba(255,77,109,0.55);
    }

    #yes:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 40px rgba(255,77,109,0.7);
    }

    #no {
      background: rgba(255,255,255,0.9);
      color: #777;
    }

    .hint {
      margin-top: 28px;
      font-size: 13px;
      color: #6b6b6b;
      font-style: italic;
    }

    .heart {
      position: absolute;
      bottom: -20px;
      animation: floatUp linear forwards;
      pointer-events: none;
      filter: blur(0.3px);
    }

    @keyframes floatUp {
      from {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
      to {
        transform: translateY(-120vh) scale(1.8);
        opacity: 0;
      }
    }

    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }

    .modal.show {
      display: flex;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: linear-gradient(135deg, #fff5f7, #ffe5ed);
      padding: 35px 25px;
      border-radius: 20px;
      text-align: center;
      max-width: 85%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      animation: slideUp 0.4s ease;
    }

    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .modal-content h3 {
      color: #4a1c2f;
      font-size: 20px;
      margin-bottom: 15px;
      font-family: "Playfair Display", serif;
    }

    .modal-content p {
      color: #555;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 10px;
      font-family: "Poppins", sans-serif;
    }

    .modal-close {
      margin-top: 20px;
      padding: 12px 32px;
      background: linear-gradient(135deg, #ff4d6d, #ff758f);
      color: white;
      border: none;
      border-radius: 25px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      box-shadow: 0 10px 25px rgba(255,77,109,0.4);
    }

    .modal-close:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(255,77,109,0.6);
    }

    .modal-close:active {
      transform: scale(0.95);
    }

    @media (max-width: 480px) {
      h2 { font-size: 23px; }
      .emoji { font-size: 58px; }
      button { padding: 12px 28px; font-size: 15px; }
      .modal-content {
        padding: 25px 18px;
      }
      .modal-content p {
        font-size: 14px;
      }
    }
  </style>
</head>

<body>

  <div class="card">
    <div class="emoji">🐱❤️</div>
    <h2>მარი,<br>გახდები ჩემი სიყვარული სამუდამოდ?</h2>

    <div class="buttons">
      <button id="yes">კი 💖</button>
      <button id="no">არა 🙈</button>
    </div>

    <div class="hint">ჩვენი სიყვარულის ისტორია "არას" არ იცნობს ✨</div>
  </div>

  <div id="successModal" class="modal">
    <div class="modal-content">
      <div style="font-size: 50px; margin-bottom: 15px;">💘</div>
      <h3>ჩემო სიყვარულო 💕</h3>
      <p>მინდა მოგილოცო ჩვენი დღე ამ პატარა საიტით რომელიც შენთვის შევქმენი 🌹💖</p>
      <p>მინდა სულ გახსოვდეს თუ როგორ მიყვარხარ, როგორ მაბედნიერებ, როგორ მავსებ სითბოთი თუ სიყვარულით..</p>
      <p>ჩემთის საუკეთესო რამ ხარ რაც ოდესმე გადამხდენია და დღესაც კი ხდება და ასე გაგრძელდება მომვალშიც..</p>
      <p>მიყვარხარ და ბედნიერი ვარ შენთან.. 💘💝💕</p>
      <p style="margin-top: 12px; font-style: italic; color: #dd6b7b;">მადლობა თითოელი წამისთვის</p>
      <button class="modal-close" onclick="closeModal()">დახურვა</button>
    </div>
  </div>

  <!-- Sounds -->
  <audio id="hoverSound" src="https://assets.mixkit.co/sfx/preview/mixkit-cartoon-voice-laugh-343.mp3"></audio>
  <audio id="yesSound" src="https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"></audio>

  <script>
    const noBtn = document.getElementById("no");
    const yesBtn = document.getElementById("yes");
    const card = document.querySelector(".card");
    const hoverSound = document.getElementById("hoverSound");
    const yesSound = document.getElementById("yesSound");

    noBtn.addEventListener("mouseenter", handleButtonEscape);
    noBtn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleButtonEscape();
    });

    function handleButtonEscape() {
      hoverSound.currentTime = 0;
      hoverSound.play();

      const cardRect = card.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();

      const maxX = Math.max(0, cardRect.width - btnRect.width - 10);
      const maxY = Math.max(0, cardRect.height - btnRect.height - 10);

      noBtn.style.left = Math.random() * maxX + "px";
      noBtn.style.top = Math.random() * maxY + "px";
    }

    yesBtn.addEventListener("click", () => {
      yesSound.play();

      confetti({
        particleCount: 260,
        spread: 120,
        origin: { y: 0.65 }
      });

      setTimeout(() => {
        showModal();
      }, 500);
    });

    function showModal() {
      const modal = document.getElementById("successModal");
      modal.classList.add("show");
    }

    function closeModal() {
      const modal = document.getElementById("successModal");
      modal.classList.remove("show");
    }

    document.getElementById("successModal").addEventListener("click", (e) => {
      if (e.target.id === "successModal") {
        closeModal();
      }
    });

    function createHeart() {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.innerHTML = Math.random() > 0.5 ? "❤️" : "💗";
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.fontSize = Math.random() * 22 + 14 + "px";
      heart.style.animationDuration = Math.random() * 3 + 4 + "s";
      heart.style.opacity = Math.random() * 0.5 + 0.4;

      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 8000);
    }

    setInterval(createHeart, 380);
  </script>

</body>
</html>

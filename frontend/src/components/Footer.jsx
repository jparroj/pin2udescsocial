//import './styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} UDESC Social. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
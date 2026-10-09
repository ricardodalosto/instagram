export default function AboutSection() {
  return (
    <section
      className="wrap developer-story"
      id="sobre"
      aria-labelledby="about-store-title"
    >
      <aside className="story-profile">
        <img
          className="story-portrait"
          src="/images/eu.jpeg"
          alt="Ricardo, desenvolvedor da RD Store"
        />
        <h3>Ricardo</h3>
        <p>Desenvolvedor do site</p>
      </aside>
      <div className="story-content">
        <p className="eyebrow">Sobre o desenvolvedor</p>
        <h2 id="about-store-title">A história do Ricardo</h2>
        <p className="story-lead">Meu nome é Ricardo.</p>
        <p>
          Sou pai de dois filhos e, durante muitos anos, construí minha história
          trabalhando no mesmo lugar. São quase 30 anos de dedicação, aprendizado,
          responsabilidades e muitos desafios.
        </p>
        <p>
          Mas, depois de tantos anos, percebi que ainda havia algo dentro de mim
          que queria crescer, aprender e buscar novos caminhos.
        </p>
        <p>
          Foi então que decidi começar uma nova jornada: entrar no mundo das vendas
          e do empreendedorismo digital.
        </p>
        <p>
          Não foi uma decisão de um dia para o outro. É um projeto que representa
          crescimento pessoal, novos conhecimentos e, principalmente, o desejo de
          construir algo meu.
        </p>
        <p>
          Foi assim que nasceu este site. Aqui, quero unir duas coisas que fazem
          parte dessa nova fase da minha vida: performance e evolução.
        </p>
        <p>
          O objetivo é trazer produtos que possam fazer parte da rotina de quem
          busca uma vida mais ativa, como equipamentos e acessórios para musculação,
          suplementos, roupas de academia e outros produtos relacionados a treino,
          saúde e desempenho.
        </p>
        <p>Mas este site é muito mais do que uma loja.</p>
        <p>Ele representa um começo.</p>
        <p>
          Um homem que passou quase 30 anos trabalhando no mesmo lugar, que construiu
          uma família, que é pai de dois filhos e que agora decidiu se desafiar
          novamente.
        </p>
        <p>
          Estou começando na área de vendas, aprendendo todos os dias, cometendo
          erros, buscando melhorar e acreditando que nunca é tarde para começar
          algo novo.
        </p>
        <p>
          Quero que essa jornada seja também uma inspiração para outras pessoas.
        </p>
        <p>
          Porque performance não é apenas levantar mais peso ou correr mais
          rápido.
        </p>
        <p>
          Performance também é acreditar em você, superar seus próprios limites e
          ter coragem para começar.
        </p>
        <div className="story-signature">
          <p>Este é o começo da minha nova história.</p>
          <strong>Eu sou Ricardo.</strong>
          <p>
            E este é o meu projeto de crescimento, evolução e transformação.
          </p>
          <div style={{ marginTop: '18px' }}>
            <a
              href="https://collshp.com/dalosto?view=storefront"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-shopee"
            >
              Conheça meu Catálogo Geral na Shopee <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

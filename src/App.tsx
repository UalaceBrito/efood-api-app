import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import styled, { createGlobalStyle } from 'styled-components'
import { useCart } from './cart-store'
import { capitalize, formatPrice, type Dish, type Restaurant } from './data'
import { useRestaurants } from './use-restaurants'

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  :root { font-family: Roboto, 'Segoe UI', Arial, sans-serif; color: #e66767; background: #fffaf2; }
  body { margin: 0; min-width: 320px; }
  a { color: inherit; }
  button { font: inherit; }
  button:focus-visible, a:focus-visible { outline: 3px solid #e66767; outline-offset: 3px; }
`

const Container = styled.div`
  width: min(1024px, calc(100% - 48px));
  margin: 0 auto;
  @media (max-width: 560px) { width: calc(100% - 32px); }
`
const HeroBar = styled.header`
  min-height: 186px;
  background: #ffebd9;
  text-align: center;
  padding: 40px 0;
`
const Logo = styled(Link)`
  display: inline-block;
  font: 900 40px/1 Georgia, serif;
  letter-spacing: -2px;
  color: #e66767;
  text-decoration: none;
  margin-bottom: 40px;
`
const HeroTitle = styled.h1`
  max-width: 540px;
  margin: 0 auto;
  font-size: clamp(24px, 4vw, 36px);
  line-height: 1.2;
  font-weight: 900;
`
const TopBar = styled.header`
  background: #ffebd9;
  height: 163px;
  display: flex;
  align-items: center;
  ${Container} { display: flex; align-items: center; justify-content: space-between; gap: 12px; font-size: 18px; font-weight: 900; }
  @media (max-width: 560px) { ${Container} { font-size: 13px; } }
`
const CoverBanner = styled.section<{ $image: string }>`
  height: 280px;
  background: linear-gradient(rgba(0,0,0,.56), rgba(0,0,0,.56)), url(${({ $image }) => $image}) center / cover no-repeat;
  color: #fff;
  ${Container} { height: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 24px 0 32px; }
  .type { font-size: 32px; font-weight: 100; }
  .name { font-size: 32px; font-weight: 900; }
  @media (max-width: 560px) { .type, .name { font-size: 24px; } }
`
const Grid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols}, minmax(0, 1fr));
  gap: 48px 80px;
  padding: 80px 0 120px;
  @media (max-width: 900px) { gap: 32px; }
  @media (max-width: 760px) { grid-template-columns: 1fr; padding: 48px 0 72px; }
`
const Card = styled.article`
  position: relative;
  background: #fff;
  border: 1px solid #e66767;
  display: flex;
  flex-direction: column;
  color: #e66767;
`
const CardImage = styled.img`
  display: block;
  width: 100%;
  height: 217px;
  object-fit: cover;
`
const Tags = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  span { background: #e66767; color: #ffebd9; padding: 6px 4px; font-size: 12px; font-weight: 700; }
`
const CardBody = styled.div`
  padding: 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  p { margin: 0; font-size: 14px; line-height: 22px; color: #4b4b4b; }
`
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  h2 { margin: 0; font-size: 18px; font-weight: 700; color: #e66767; }
  .rating { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 18px; }
`
const ButtonLink = styled(Link)`
  align-self: flex-start;
  background: #e66767;
  color: #ffebd9;
  font-size: 14px;
  font-weight: 700;
  padding: 6px 4px;
  text-decoration: none;
`
const ActionButton = styled.button`
  background: #ffebd9;
  color: #e66767;
  border: 0;
  padding: 4px 6px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #fff; }
`
const DishCard = styled.article`
  background: #e66767;
  color: #ffebd9;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  img { width: 100%; height: 167px; object-fit: cover; display: block; }
  h3 { margin: 0; font-size: 16px; font-weight: 900; }
  p { margin: 0; font-size: 14px; line-height: 22px; flex: 1; }
`
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, .8);
`
const Modal = styled.div`
  position: relative;
  width: min(1024px, 100%);
  max-height: calc(100vh - 32px);
  overflow: auto;
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  padding: 32px;
  background: #e66767;
  color: #fff;
  img { width: 280px; height: 280px; object-fit: cover; display: block; }
  h2 { margin: 0 0 16px; font-size: 18px; font-weight: 900; }
  p { margin: 0 0 16px; font-size: 14px; line-height: 22px; }
  @media (max-width: 720px) { grid-template-columns: 1fr; padding: 24px 16px; img { width: 100%; height: 220px; } }
`
const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent url('/images/close.svg') center / 16px no-repeat;
  cursor: pointer;
`
const BuyButton = styled(ActionButton)`
  padding: 4px 8px;
`
const Status = styled.p`
  padding: 80px 0;
  text-align: center;
  color: #e66767;
  font-weight: 700;
  button { margin-top: 16px; background: #e66767; color: #ffebd9; border: 0; padding: 8px 12px; font-weight: 700; cursor: pointer; }
`
const Footer = styled.footer`
  background: #ffebd9;
  text-align: center;
  padding: 40px 16px;
  font-size: 10px;
  color: #e66767;
  strong { display: block; font: 900 28px Georgia, serif; margin-bottom: 32px; letter-spacing: -2px; }
  p { max-width: 480px; margin: 0 auto; }
`

function LoadStatus({ state, retry }: { state: ReturnType<typeof useRestaurants>['state']; retry: () => void }) {
  if (state.status === 'loading') return <Status role="status">Carregando restaurantes…</Status>
  if (state.status === 'error') {
    return <Status role="alert">{state.message}<br /><button type="button" onClick={retry}>Tentar novamente</button></Status>
  }
  return null
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Card>
      <CardImage src={restaurant.capa} alt={restaurant.titulo} />
      <Tags>
        {restaurant.destacado && <span>Destaque da semana</span>}
        <span>{capitalize(restaurant.tipo)}</span>
      </Tags>
      <CardBody>
        <TitleRow>
          <h2>{restaurant.titulo}</h2>
          <span className="rating" aria-label={`Avaliação ${restaurant.avaliacao}`}>{restaurant.avaliacao} ★</span>
        </TitleRow>
        <p>{restaurant.descricao}</p>
        <ButtonLink to={`/restaurante/${restaurant.id}`}>Saiba mais</ButtonLink>
      </CardBody>
    </Card>
  )
}

function HomePage() {
  const { state, retry } = useRestaurants()
  return (
    <>
      <HeroBar>
        <Logo to="/" aria-label="efood, página inicial">efood</Logo>
        <HeroTitle>Viva experiências gastronômicas no conforto da sua casa</HeroTitle>
      </HeroBar>
      <Container>
        <LoadStatus state={state} retry={retry} />
        {state.status === 'ready' && (
          <Grid $cols={2}>
            {state.restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}
          </Grid>
        )}
      </Container>
    </>
  )
}

function truncate(text: string, max = 140) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text
}

function RestaurantPage() {
  const { id } = useParams()
  const { state, retry } = useRestaurants()
  const { count, addItem } = useCart()
  const [selected, setSelected] = useState<Dish | null>(null)
  const restaurant = state.status === 'ready' ? state.restaurants.find((item) => String(item.id) === id) : undefined

  return (
    <>
      <TopBar>
        <Container>
          <Link to="/">Restaurantes</Link>
          <Link to="/" aria-label="efood, página inicial" style={{ font: '900 40px Georgia, serif', letterSpacing: -2, textDecoration: 'none' }}>efood</Link>
          <span>{count} produto(s) no carrinho</span>
        </Container>
      </TopBar>
      <LoadStatus state={state} retry={retry} />
      {state.status === 'ready' && !restaurant && (
        <Status>Restaurante não encontrado. <br /><Link to="/">Voltar para a lista</Link></Status>
      )}
      {restaurant && (
        <>
          <CoverBanner $image={restaurant.capa}>
            <Container>
              <span className="type">{capitalize(restaurant.tipo)}</span>
              <span className="name">{restaurant.titulo}</span>
            </Container>
          </CoverBanner>
          <Container>
            <Grid $cols={3}>
              {restaurant.cardapio.map((dish) => (
                <DishCard key={dish.id}>
                  <img src={dish.foto} alt={dish.nome} loading="lazy" />
                  <h3>{dish.nome}</h3>
                  <p>{truncate(dish.descricao)}</p>
                  <ActionButton type="button" onClick={() => setSelected(dish)}>Comprar o produto</ActionButton>
                </DishCard>
              ))}
            </Grid>
          </Container>
          {selected && (
            <DishModal dish={selected} onClose={() => setSelected(null)} onBuy={() => { addItem(selected, restaurant.id); setSelected(null) }} />
          )}
        </>
      )}
    </>
  )
}

function DishModal({ dish, onClose, onBuy }: { dish: Dish; onClose: () => void; onBuy: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <Overlay onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <Modal role="dialog" aria-modal="true" aria-labelledby="dish-title">
        <CloseButton ref={closeRef} type="button" aria-label="Fechar" onClick={onClose} />
        <img src={dish.foto} alt={dish.nome} />
        <div>
          <h2 id="dish-title">{dish.nome}</h2>
          <p>{dish.descricao}</p>
          <p>Serve: {dish.porcao}</p>
          <BuyButton type="button" onClick={onBuy}>Adicionar ao carrinho - {formatPrice(dish.preco)}</BuyButton>
        </div>
      </Modal>
    </Overlay>
  )
}

function Layout() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurante/:id" element={<RestaurantPage />} />
        <Route path="*" element={<Status>Página não encontrada. <Link to="/">Voltar</Link></Status>} />
      </Routes>
      <Footer>
        <strong>efood</strong>
        <p>A efood é uma plataforma para divulgação de estabelecimentos, a responsabilidade pela entrega, qualidade dos produtos é toda do estabelecimento contratado.</p>
      </Footer>
    </>
  )
}

export default function App() {
  return <BrowserRouter><GlobalStyle /><Layout /></BrowserRouter>
}

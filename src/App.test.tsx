import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

async function reachInvite() {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('button', { name: /začať malú misiu/i }))
  expect(screen.getByAltText(/momentka troch kamarátok/i)).toBeInTheDocument()
  expect(screen.getByAltText(/čiernobiela momentka dvoch kamarátok/i)).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /^pokračovať$/i }))
  for (let i = 1; i <= 5; i += 1) {
    await user.click(screen.getByRole('button', { name: `Chytiť srdiečko ${i}` }))
  }

  expect(screen.getByText('5 z 5.')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /pokračovať/i }))

  expect(screen.getByText('Bilancia sedí.')).toBeInTheDocument()
  expect(screen.getByText('Počet pozvaní')).toBeInTheDocument()
  expect(screen.getByText('Šanca na dobrú kávu')).toBeInTheDocument()

  await user.click(screen.getByRole('button', { name: /odomknúť otázku/i }))
  return user
}

describe('Project Lucia V1.1', () => {
  it('walks through intro, photo experience, game and balance into the invitation', async () => {
    await reachInvite()
    expect(screen.getByText('Lucia, pôjdeš so mnou niekedy na kávu?')).toBeInTheDocument()
    expect(screen.getByText(/účtovníckym pokecom/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /káva & spoznávanie/i })).toBeInTheDocument()
  })

  it.each([
    ['Káva & spoznávanie', /tak toto má dobrú bilanciu/i],
    ['Účtovnícky pokec', /účtovníctvo má zrazu lepší marketing/i],
    ['Možno inokedy', /ďakujem, že si si to pozrela/i],
  ])('renders a respectful ending for %s', async (label, expected) => {
    const user = await reachInvite()
    await user.click(screen.getByRole('button', { name: new RegExp(label, 'i') }))
    expect(screen.getByText(expected)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /skopírovať odpoveď/i })).toBeInTheDocument()
  })

  it('copies the prepared response', async () => {
    const user = await reachInvite()
    await user.click(screen.getByRole('button', { name: /káva & spoznávanie/i }))
    await user.click(screen.getByRole('button', { name: /skopírovať odpoveď/i }))
    expect(screen.getByRole('button', { name: /skopírované/i })).toBeInTheDocument()
  })
})

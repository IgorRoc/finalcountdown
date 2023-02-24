let vh = window.innerHeight * 0.01
document.documentElement.style.setProperty("--vh", `${vh}px`)

let wrapper = document.querySelector("#wrapperNotas")
let novaNota = document.querySelector("#novaNota")
let botaoAddNota = document.querySelector("#botaoAddNota")
let btnReset = document.querySelector("#resetNotas")

document.querySelector("#peso").value = 10
botaoAddNota.addEventListener("click", addNota)
window.addEventListener("keypress", function (e) {
	if (e.key == "Enter") addNota()
})
document.querySelector("#nota").focus()
btnReset.addEventListener("click", resetNotas)

function addNota() {
	let nota = document.querySelector("#nota")
	let notaValue = nota.value
	let peso = document.querySelector("#peso")
	let pesoValue = peso.value

	nota.value = ""

	if (!pesoValue) {
		console.error("É necessário um peso")
		return
	}

	insereNovaNota(notaValue, pesoValue)

	verificaMedia()
}

function insereNovaNota(nota, peso) {
	let inserirNota = document.querySelector("#novaNota")

	let newNota = document.createElement("div")
	newNota.classList.add("nota")
	let info1 = document.createElement("div")
	info1.classList.add("info")
	let value1 = document.createElement("span")
	value1.classList.add("value")
	value1.innerText = nota || "?"
	let info2 = document.createElement("div")
	info2.classList.add("info")
	let value2 = document.createElement("span")
	value2.classList.add("value")
	value2.innerText = peso
	let excluir = document.createElement("div")
	excluir.classList.add("icon")

	info1.innerHTML = "Nota: "
	info1.appendChild(value1)
	info2.innerHTML = "Peso: "
	info2.appendChild(value2)
	excluir.innerHTML = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" > <path d="M19 24h-14c-1.104 0-2-.896-2-2v-17h-1v-2h6v-1.5c0-.827.673-1.5 1.5-1.5h5c.825 0 1.5.671 1.5 1.5v1.5h6v2h-1v17c0 1.104-.896 2-2 2zm0-19h-14v16.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-16.5zm-7 7.586l3.293-3.293 1.414 1.414-3.293 3.293 3.293 3.293-1.414 1.414-3.293-3.293-3.293 3.293-1.414-1.414 3.293-3.293-3.293-3.293 1.414-1.414 3.293 3.293zm2-10.586h-4v1h4v-1z" /> </svg>`
	excluir.setAttribute("onclick", "excluirNota(this)")
	newNota.appendChild(info1)
	newNota.appendChild(info2)
	newNota.appendChild(excluir)

	wrapper.insertBefore(newNota, inserirNota)
}

function excluirNota(object) {
	object.parentElement.remove()
	verificaMedia()
	if (wrapper.childElementCount <= 1) {
		let obs = document.querySelector("#finalValue")
		obs.innerHTML = `Insira suas notas para eu calcular!<br />Deixe <span class="mediaYellow">vazio</span> o campo de <span class="mediaYellow">nota</span> para que eu possa te mostrar quanto você precisa.`
	}
}

function verificaMedia() {
	let wrapper = document.querySelector("#wrapperNotas")
	let finalValue = document.querySelector("#finalValue")
	let media = 0
	let dividendo = 0
	let divisor = 0
	let existeNotaCoringa = 0

	for (const nota of wrapper.children) {
		if (nota.id == "novaNota") break
		let valor = nota.children[0].children[0].innerText
		let peso = nota.children[1].children[0].innerText
		if (valor == "?") {
			existeNotaCoringa++
		} else {
			dividendo += valor * peso
		}
		divisor += parseInt(peso)
	}

	media = dividendo / divisor

	if (existeNotaCoringa) {
		if (media >= 7) {
			finalValue.innerHTML = `Mesmo se você tirar <u>0.0</u> nas notas coringa, você passa com <span class="mediaGreen">${media}</span>. <span class="motivacional">Cê é o bichão mesmo ein?</span>😎`
		} else {
			let necessario = (divisor * 7 - dividendo) / 10 / existeNotaCoringa
			if (necessario > 10) {
				media = (dividendo + 100) / divisor
				let quantoPrecisa = (5 - media * 0.6) / 0.4
				let formatted = parseFloat(quantoPrecisa).toFixed(2)

				finalValue.innerHTML = `Se você tirar <span class="mediaRed">10.0</span> em cada nota coringa, você precisa tirar <span class="mediaRed">${formatted}</span> na final para passar. <span class="motivacional">Tá complicado, mas vai que dá!</span>🤗`
			} else {
				let texto = "Você precisa tirar "
				let mensagemMotivacional = ""
				let emojiMotivacional = ""
				if (necessario < 7) {
					texto += `<span class="mediaGreen">${necessario}</span>`
					mensagemMotivacional = "Metendo essa, você passa!"
					emojiMotivacional = "🎉"
				} else if (necessario >= 9) {
					texto += `<span class="mediaRed">${necessario}</span>`
					mensagemMotivacional = "Veja pelo lado bom: dá pra passar sem final!"
					emojiMotivacional = "🫠"
				} else {
					texto += `<span class="mediaRed">${necessario}</span>`
					mensagemMotivacional = "Mas não se preocupe, você consegue!"
					emojiMotivacional = "🤗"
				}
				finalValue.innerHTML = `${texto} em cada nota coringa para passar.
				<span class="motivacional">${mensagemMotivacional}</span>${emojiMotivacional}`
			}
		}
	} else {
		let mediaComCor
		media = media.toFixed(2)
		if (media < 7) {
			mediaComCor = `<span class="mediaRed">${media}</span>`
			let quantoPrecisa = (5 - media * 0.6) / 0.4
			let formatted = parseFloat(quantoPrecisa).toFixed(2)
			let formattedComCor = `<span class="needsGrade">${formatted}</span>`

			if (parseFloat(formatted) > 10) {
				finalValue.innerHTML = `Sua média é ${mediaComCor}. Nem tirando 10 na final você consegue passar na disciplina. <span class="motivacional">Não foi dessa vez, vamos deixar pro próximo semestre</span>😓`
			} else if (parseFloat(formatted) >= 7) {
				finalValue.innerHTML = `Sua média é ${mediaComCor}. Você precisa tirar ${formattedComCor} na final para passar na disciplina. <span class="motivacional">Sei que tá difícil, mas deixar pro próximo semestre é pior</span> 😉`
			} else if (parseFloat(formatted) >= 5) {
				finalValue.innerHTML = `Sua média é ${mediaComCor}. Você precisa tirar ${formattedComCor} na final para passar na disciplina. <span class="motivacional">Não tá tão complicado assim. Vai que dá!</span> 😉`
			} else {
				finalValue.innerHTML = `Sua média é ${mediaComCor}. Você precisa tirar ${formattedComCor} na final para passar na disciplina. <span class="motivacional">Falta pouco pra você se livrar dessa matéria!</span> 😎`
			}
		} else if (media > 10) {
			mediaComCor = `<span class="mediaGreen">${media}</span>`
			finalValue.innerHTML = `Não tenho ideia de como você conseguiu. Mas sua média é ${mediaComCor}! <span class="motivacional">Você tá mais do que aprovado! Me ensina?</span> 🥺<span class="dedoEsquerdo">👉</span><span class="dedoDireito">👈</span>`
		} else if (media == 10) {
			mediaComCor = `<span class="mediaGreen">${media}</span>`
			finalValue.innerHTML = `Você é o novo Einstein? Não? Por que sua média é ${mediaComCor}! <span class="motivacional">Meteu essa?</span> 😎`
		} else if (media >= 8.5) {
			mediaComCor = `<span class="mediaGreen">${media}</span>`
			finalValue.innerHTML = `Sua média é ${mediaComCor}! <span class="motivacional">Continue assim e logo logo o 10.0 é seu!</span> 💪`
		} else if (media > 7) {
			mediaComCor = `<span class="mediaGreen">${media}</span>`
			finalValue.innerHTML = `Sua média é ${mediaComCor}. <span class="motivacional">Você está fazendo um ótimo trabalho!</span> 😉`
		} else if (media == 7) {
			mediaComCor = `<span class="mediaGreen">${media}</span>`
			finalValue.innerHTML = `Sua média é exatamente ${mediaComCor}. <span class="motivacional">Foi no limite, ein?</span> 😅`
		} else {
			mediaComCor = `<span class="mediaGreen">${media}</span>`
			finalValue.innerHTML = `Sua média é ${mediaComCor}. <span class="motivacional">Parabéns, você passou!</span> 🎉`
		}
	}
}

function resetNotas() {
	let first = wrapper.children[0]
	while (first.id != "novaNota") {
		first.remove()
		first = wrapper.children[0]
	}

	let obs = document.querySelector("#finalValue")
	obs.innerHTML = `Insira suas notas para eu calcular!<br />Deixe <span class="mediaYellow">vazio</span> o campo de <span class="mediaYellow">nota</span> para que eu possa te mostrar quanto você precisa.`
}

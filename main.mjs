const key = 'ab7a1914ea2f4f4bbd0200123212509'
let body = document.querySelector("body");
let input = document.querySelector("input");
let navIcon = document.querySelector("#nav__icon");
let temperatura = document.querySelector("#temperatura");
let nomeDoLugar = document.querySelector(".card_cidade__nome_do_lugar");
let cardClima = document.querySelector(".card_cidade__clima_temp");
let climaDescricao = document.querySelector(".card_cidade__clima_descricao");
let umidadeTxt = document.querySelector(".umidade");
let veloidadeVento = document.querySelector(".velocidade_vento");
let sensacaoTermica = document.querySelector(".sensacao_term");
let amanhaNome = document.querySelector('.card_clima_amanha')
let minimaDias = document.querySelector('.minima')
let depoisAmanhaNome = document.querySelector('.card_clima_depois_de_amanha')
let maximaDias = document.querySelector('.maxima')
let video = document.querySelector("video");
let source = document.querySelector("source");

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    let valorPesquisado = input.value.normalize("NFD").replace(/[\u0300-\u036f]/gi, "") || "Brasil"
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${valorPesquisado}&aqi=no&days=3&lang=pt`
      )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        document.querySelector('.card_cidade').style = `display: flex` 
        const ordenaTemp = (i,j) => {
           const tempMinMax = data.forecast.forecastday[i].hour.sort((a,b)=>a.temp_c-b.temp_c)
           return tempMinMax[j]
        }
        const climaProps = {
          temp: Math.round(Number(data.current.temp_c)),
          icone: data.current.condition.icon,
          cidade: data.location.name,
          estado: data.location.region,
          pais: data.location.country,
          umidade: data.current.humidity,
          vento: data.current.wind_mph,
          sensacao_termica: data.current.feelslike_c,
          condicao: data.current.condition.text,
          amanha: new Date(data.forecast.forecastday[1].hour[0].time_epoch*1000).getDay(),
          depois_de_amanha: new Date(data.forecast.forecastday[2].hour[0].time_epoch*1000).getDay(),
          dias_da_semana: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
          minima_amanha: ordenaTemp(1,0).temp_c,
          minima_amanha_icone: ordenaTemp(1,0).condition.icon,
          maxima_amanha: ordenaTemp(1,23).temp_c,
          maxima_amanha_icone: ordenaTemp(1,23).condition.icon,
          minima_depois_de_amanha: ordenaTemp(2,0).temp_c,
          minima_depois_de_amanha_icone: ordenaTemp(2,0).condition.icon,
          maxima_depois_de_amanha: ordenaTemp(2,23).temp_c,
          maxima_depois_de_amanha_icone: ordenaTemp(2,23).condition.icon,
        };

        
        const {temp,icone,cidade,estado,pais,umidade,vento, sensacao_termica, condicao,amanha,
               depois_de_amanha,dias_da_semana, minima_amanha, minima_amanha_icone, maxima_amanha,
               maxima_amanha_icone,minima_depois_de_amanha,minima_depois_de_amanha_icone,
               maxima_depois_de_amanha,maxima_depois_de_amanha_icone} = climaProps
          
        // body.style = `background:none`;
        condicao === condicoes[0] ? video.src = "video/dia.mp4" :
        condicao === condicoes[1] ? video.src = "video/noite.mp4" : 
        condicoesNublado.includes(condicao) ? video.src = "video/nublado.mp4" :
        condicoesChuva.includes(condicao) ? video.src = "video/chuva.mp4" : 
        condicoesNeve.includes(condicao) ? video.src = "video/neve.mp4" :
        body.style = `background: #2c3e50`
        temperatura.innerHTML = `${temp}ºC`;
        navIcon.src = icone;
        nomeDoLugar.innerHTML = `${cidade}, ${
          pais === "Brazil" ? estado : pais
        }`;
        cardClima.innerHTML = `<span>${temp}º</span> <hr>`;
        climaDescricao.innerHTML = `${condicao}`;
        

        amanhaNome.style = `display: flex`

        amanhaNome.innerHTML = `<span id="amanha">${dias_da_semana[amanha]}</span>
                                <div class="minmax_amanha">
                                   <span class="minima"> Mínima - 
                                      <span>${minima_amanha}ºC
                                        <img src="${minima_amanha_icone}">
                                      </span>
                                   </span>
                                   <span  class="maxima"> Máxima - 
                                    <span>${maxima_amanha}ºC
                                      <img src="${maxima_amanha_icone}">
                                    </span>
                                   </span>  
                                </div>`

        depoisAmanhaNome.style = `display:flex`

        depoisAmanhaNome.innerHTML = `<span id="amanha">${dias_da_semana[depois_de_amanha]}</span>
                                      <div class="minmax_depois_de_amanha">
                                        <span class="minima"> Mínima - 
                                        <span>
                                        ${minima_depois_de_amanha}ºC
                                          <img src="${minima_depois_de_amanha_icone}">
                                          </span>
                                        </span>
                                        <span class="maxima"> Máxima - 
                                        <span>
                                        ${maxima_depois_de_amanha}ºC
                                          <img src="${maxima_depois_de_amanha_icone}">
                                        </span>
                                        </span>
                                      </div>`


        umidadeTxt.innerHTML = ` <span id="umidade">Umidade</span> <span>${umidade}% <i class="fas fa-tint"></i></span>`;
        veloidadeVento.innerHTML = `<span id="vento">Vento</span> <span>${vento}m/h <i class="fas fa-wind"></i></span>`;
        sensacaoTermica.innerHTML = `<span id="sensacao_term">Sensação Térmica
                                     </span>
                                     <span>${sensacao_termica}ºC
                                     <img src=${icone}>
                                     </span>`;
      });
    }
  });
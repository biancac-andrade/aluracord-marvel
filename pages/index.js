import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';
import React from 'react'
import {useRouter} from 'next/router'


function Titulo(props) {
  const Tag = props.tag || 'h1';
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
            ${Tag} {
                color: ${appConfig.theme.colors.marvel['010']};
                font-size: 24px;
                font-weight: 600;
            }
            `}</style>
    </>
  );
}

// Componente React
// function HomePage() {
//     // JSX
//     return (
//         <div>
//             <GlobalStyle />
//             <Titulo tag="h2">Boas vindas de volta!</Titulo>
//             <h2>Discord - Alura Matrix</h2>
//         </div>
//     )
// }
// export default HomePage

export default function PaginaInicial() {
 //const username = 'peas';
  // const stateDoReact = React.useState('omariosouto')
  // console.log('stateDoReact', stateDoReact)
  const [username, setUsername] = React.useState('biancac-andrade')
  const roteamento = useRouter();
  //console.log(roteamento)
  return (
    <>
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundImage: 'url(https://terrigen-cdn-dev.marvel.com/content/prod/1x/mvl_halloween-bg-04-3840x2160.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        <Box
           styleSheet={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            width: '100%', maxWidth: '700px',
            borderRadius: '5px', padding: '32px', margin: '16px',
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            backgroundColor: appConfig.theme.colors.marvel['014'],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function (infoDoEvento) {
              infoDoEvento.preventDefault();
              console.log('alguem submeteu o form')
              //window.location.href = '/chat';
              roteamento.push(`/chat?username=${username}`);
          }}
            styleSheet={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
            }}
          >
            <Titulo tag="h2">Boas vindas de volta!</Titulo>
            <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.marvel['012']}}>
              {appConfig.name}
            </Text>

            {/* <input
              type="text"
              value={username}
              onchange={function (event) {
                console.log('usuario digitou', event.target.value);
                // onde ta o valor  
                const valor = event.target.value
                // trocar o valor da variavel
                //atraves do react e avise quem precisa
                setUsername(valor)
              }}
            /> */}
            <TextField
              value={username}
              onchange={function (event) {
                console.log('usuario digitou', event.target.value);
                // onde ta o valor  
                const valor = event.target.value
                // trocar o valor da variavel
                //atraves do react e avise quem precisa
                setUsername(valor)
              }}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.marvel['013'],
                  mainColor: appConfig.theme.colors.neutrals[999],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals["000"],
                },
              }}
            />
            <Button
              type='submit'
              label='Entrar'
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["999"],
                mainColor: appConfig.theme.colors.marvel['009'],
                mainColorLight: appConfig.theme.colors.marvel['008'],
                mainColorStrong: appConfig.theme.colors.marvel['007'],
              }}
            />
          </Box>
          {/* Formulário */}


          {/* Photo Area */}
          <Box
            styleSheet={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '200px',
              padding: '16px',
              backgroundColor: appConfig.theme.colors.marvel['010'],
              border: '3px solid',
              borderColor: appConfig.theme.colors.marvel['012'],
              borderRadius: '20px',
              flex: 1,
              minHeight: '30px',
            }}
          >
            <Image
              styleSheet={{
                borderRadius: '200%',
                marginBottom: '16px',
                
              }}
              src={`https://github.com/${username}.png`}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[999],
                backgroundColor: appConfig.theme.colors.marvel['006'],
                padding: '8px 20px',
                borderRadius: '7px'
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}

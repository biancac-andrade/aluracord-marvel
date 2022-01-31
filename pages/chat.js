import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/router';
import {ButtonSendSticker} from './../src/components/ButtonSendSticker';

// Como fazer AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6
const SUPBASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY0Mjc0MSwiZXhwIjoxOTU5MjE4NzQxfQ.Rh6ftsWJ7_KTFN3LnmLF0cJ5Wo9EyobyGQRn869P-GE';
const SUPBASE_URL = 'https://omobihninzkipligveyf.supabase.co';
const supabaseClient = createClient(SUPBASE_URL, SUPBASE_ANON_KEY)

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (respostaLive) => {
            adicionaMensagem(respostaLive.new)
        })
        .subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username
    const [mensagem, setMensagem] = React.useState('')
    const [listaDeMensagens, setListaDeMensagens] = React.useState([])
    /*
    usuario
    - usuario digita no campo textarea 
    - aperta enter para enviar
    - tem que adicionar o texto na listagem
    dev
    - [x]campo criado
    -vamos usar o onchange usa o useState ( ter if par caso seja enter para limpar a variavel)
    -[] lista de mensagem 
    */
    React.useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', {ascending: false})
            .then(({data}) => {
                // console.log('Dados da consulta: ', data);
                setListaDeMensagens(data)
            })
        const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem)
            console.log('listaDeMensagens: ', listaDeMensagens)
            // handleNovaMensagem(novaMensagem)
            setListaDeMensagens((valorAtualDaLista) => {
                console.log('valorAtualDaLista', valorAtualDaLista)
                return [
                    novaMensagem,
                    ...valorAtualDaLista,
                ]
            });
        });
        return () => {
            subscription.unsubscribe();
        }
    }, []);
    

    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        };
        supabaseClient
            .from('mensagens')
            //tem que ser um objeto com os MESMO CAMPOS que voce escreveu no supabase
            .insert([
                mensagem
            ])
            .then(({ data }) => {
                console.log('criando mensagem: ', data);
                // setListaDeMensagens([
                //     data[0],
                //     ...listaDeMensagens,
                // ]);
            });
        setMensagem('')

        //chamada de backend
        // setListaDeMensagens([
        //     mensagem,
        //     ...listaDeMensagens,
          
        // ]);
        // setMensagem('');
    }
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundImage: `url(https://terrigen-cdn-dev.marvel.com/content/prod/1x/mvl_halloween-bg-04-3840x2160.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.marvel['005'],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.marvel['006'],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    {/* //ta mudando o valor {mensagem}}
                    <MessageList mensagens={[]} /> 
                    {listaDemensagens.map((mensagemAtual) => {
                        return(
                            <li key={mensagemAtual.id}>                            
                                {mensagemAtual.de} : {mensagemAtual.texto}
                        </li>
                        )
                    })}
                    
                     <MessageList /> 
                    {listaDemensagens} */}
                    <MessageList mensagens={listaDeMensagens} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                    // console.log(event)
                                    // setlistaDemensagens([
                                    //     ...listaDemensagens,
                                    //     mensagem,
                                    // ]);
                                    // setMensaagem();
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[100],
                                marginRight: '12px',
                                color: appConfig.theme.colors.marvel['014'],
                            }}
                        />
                        {/* CALLBACK */}
                        <ButtonSendSticker
                            onStickerClick={(sticker) => {
                                // console.log('Salva esse sticker no banco', sticker);
                                handleNovaMensagem(':sticker:' + sticker)
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    //console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals[999],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.marvel['012'],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[999],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {/* {mensagem.texto} */}
                        {/* Declarativo */}
                        {/* Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image src={mensagem.texto.replace(':sticker:', '')} />
                            )
                            : (
                                mensagem.texto
                            )}
                        {/* if mensagem de texto possui stickers:
                           mostra a imagem
                        else 
                           mensagem.texto */}
                        {/* {mensagem.texto} */}                        
                    </Text>
                );
            })}           
        </Box>
    )
}
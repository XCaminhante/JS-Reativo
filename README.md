# JavaScript-Reativo
Eventos e valores reativos com ou sem detecção de dependências, em estilo de orientação à objetos.

## Eventos

```var e = new Evento()
e.assinar( (a)=>{ console.log('oi '+a) } )
e.invocar('pessoa')
// "oi pessoa" é emitido no terminal```

## Valores reativos

```var a = new ValorReativo(3)
console.log( a() ) // emite '3'
a.assinar( (nv)=>{ console.log('a mudou para '+nv) } )
a(4) // emite "a mudou para 4"```

## Valores reagindo em cascata, com detecção de dependências

```var obs = new ObservadorValores()
var a = obs.valor(1)
var b = obs.valor(2)
var c = obs.derivado(()=>{ return a() + b() })
// agora 'c' receberá eventos quando 'a' ou 'b' receberem valores novos
c.assinar( (nv)=>{ console.log('c mudou para '+nv) } )
c(1) // "c mudou para 1"
a(2) // "c mudou para 4"
b(3) // "c mudou para 5"```

## Detecção simples de dependências circulares

```var obs = new ObservadorValores()
var a = obs.valor(1)
var b = obs.derivado(()=>{ return a() + 1 })
// dispara a excessão "Error: Dependência circular encontrada"
var c = obs.derivado(()=>{ return a(b()) + 2 })```


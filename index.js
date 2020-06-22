function Evento () {
  var _assinantes = []
  function assinar (callback) {
    if (_assinantes.indexOf(callback)==-1) { _assinantes.push(callback) }
  }
  function remover (callback) {
    var pos = _assinantes.indexOf(callback)
    if (pos != -1) { _assinantes.splice(pos,1) }
  }
  function removerTodos () {
    _assinantes = []
  }
  function invocar (_dados) {
    var assin = []
    assin.push.apply(assin,_assinantes)
    var args = arguments
    assin.forEach(function(c){ c.apply(null,args) })
  }
  return {assinar,remover,removerTodos,invocar}
}
function ValorReativo (_valor) {
  var _ev_escrita = new Evento()
  function atualizar (novo) {
    var velho = _valor
    if (arguments.length) {
      if (novo === velho && typeof(novo) !== 'object') { return velho }
      _valor = novo
      _ev_escrita.invocar(novo)
    }
    return velho
  }
  atualizar.assinar = _ev_escrita.assinar
  atualizar.remover = _ev_escrita.remover
  atualizar.removerTodos = _ev_escrita.removerTodos
  return atualizar
}
function ObservadorValores () {
  var dependencias = []
  function testarDependenciaCircular (depend) {
    if (dependencias.indexOf(depend) != -1) {
      throw(Error('Dependência circular encontrada'))
    }
  }
  function valor (_valor) {
    var v = new ValorReativo(_valor)
    function atualizar (novo) {
      if (!arguments.length) {
        var dependencia = dependencias[dependencias.length-1]
        if (dependencia) { v.assinar(dependencia) }
      }
      return v.apply(v,arguments)
    }
    atualizar.assinar = v.assinar
    atualizar.remover = v.remover
    atualizar.removerTodos = v.removerTodos
    return atualizar
  }
  function derivado (_funcao) {
    var v = new valor()
    var depend = atualizar
    function atualizar () {
      testarDependenciaCircular(depend)
      dependencias.push(depend)
      var erro, res
      try { res = _funcao() }
      catch (e) { erro = e }
      dependencias.pop()
      if (erro) { throw(erro) }
      v(res)
    }
    atualizar()
    return v
  }
  return {valor,derivado}
}
module.exports = {Evento,ValorReativo,ObservadorValores}

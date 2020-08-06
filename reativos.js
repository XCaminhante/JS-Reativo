function ValorReativo (_valor) {
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
  function invocar (dados) {
    var a = []
    a.push.apply(a,_assinantes)
    a.forEach(function(c){ c.call(null,dados) })
  }
  function valor (novo) {
    var velho = _valor
    if (arguments.length) {
      if (novo === velho && typeof(novo) !== 'object') { return velho }
      _valor = novo
      invocar(novo)
    }
    return velho
  }
  return {assinar,remover,removerTodos,valor}
}
function Observador () {
  var _dependencias = []
  function testarDependenciaCircular (depend) {
    if (_dependencias.indexOf(depend) != -1) {
      throw(Error('Dependência circular encontrada'))
    }
  }
  function valor (_valor) {
    var v = new ValorReativo(_valor)
    function atualizar (novo) {
      if (!arguments.length) {
        var d = _dependencias[_dependencias.length-1]
        if (d) { v.assinar(d) }
      }
      return v.valor.apply(v,arguments)
    }
    atualizar.assinar = v.assinar
    atualizar.remover = v.remover
    atualizar.removerTodos = v.removerTodos
    return atualizar
  }
  function derivado (funcao) {
    var v = valor()
    var depend = atualizar
    function atualizar () {
      testarDependenciaCircular(depend)
      _dependencias.push(depend)
      var erro, resul
      try { resul = funcao() }
      catch (e) { erro = e }
      _dependencias.pop()
      if (erro) { throw(erro) }
      v(resul)
    }
    atualizar()
    return v
  }
  return {valor,derivado}
}
module.exports = {ValorReativo,Observador}

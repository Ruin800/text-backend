const resource1 = `[#M1#local a={}function a:cloneLocalScript(b)if b then script.LocalScript:Clone().Parent=game:GetService("ReplicatedFirst")else print("NAAH")end end;return a#L1#print("")#S1#print("Hello there")#END#M1{L1S1}#NAME#M1MainModule,L1LocalScript,S1SuperScript`;

const veryCoolScript = `[#M1#print("This is very cool")#END#M1{}#NAME#M1CoolModule]`;

module.exports = {
  resource1,
  veryCoolScript,
};
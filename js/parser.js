let isRegisterName = (reg) => "abcdehl".indexOf(reg) !== -1
let i2h = i => i
let h2i = h => i
let aCharCode = "a".charCodeAt(0)

// TODO: LXI, MVI, ORA, POP, PUSH, RST, SBB, STAX, SUB, xra

let mov = {// a		b	 c 		d	  e	   f	g	h    l		m
		a: 	["7f", "78", "79", "7a", "7b", null, null, "7c", "7d", "77"],
		b:	["47", "40", "41", "42", "43", null, null, "44", "45", "70"],
		c:	["41", "48", "49", "4a", "4b", null, null, "4c", "4d", "71"],
		d:	["57", "50", "51", "52", "53", null, null, "54", "55", "72"],
		e:	["5f", "58", "59", "5a", "5b", null, null, "5c", "5d", "73"],
		h:	["67", "60", "61", "62", "63", null, null, "64", "65", "74"],
		l:	["6f", "68", "69", "6a", "6b", null, null, "6c", "6d", "75"],
		m:	["7e", "46", "4e", "56", "5e", null, null, "66", "6e"]
}

let add = {a : "87", b : "80", c : "81", d :"82", e:"83", h:"84", l:"85", m : "86" }
let adc = {a : "8f", b : "88", c : "89", d :"8a", e:"8b", h:"8c", l:"8d", m : "8e" }
let ana = {a : "a7", b : "a0", c : "a1", d :"a2", e:"a3", h:"a4", l:"a5", m : "a6" }
let cmp = {a : "bf", b : "b8", c : "b9", d :"ba", e:"bb", h:"bc", l:"bd", m : "be" }
let dad = {bc: "09", de: "19", hl: "29", sp:"39"}
let dcr = {a : "3d", b : "05", c : "0d", d :"15", e:"1d", h:"25", l:"2d", m : "35" }
let dcx = {bc: "0b", de: "1b", hl: "2b", sp:"3b"}
let inr = {a : "3c", b : "04", c : "0c", d :"14", e:"1c", h:"24", l:"2c", m : "34" }
let inx = {bc: "03", de: "13", hl: "23", sp:"33"}
let ldax = {bc: "0a", de: "1a"}

function littleEndian(str){
	if(str.length !== 4)
		return str;
	let aa = str.charAt(0) + str.charAt(1)
	let bb = str.charAt(2) + str.charAt(3)
	return [bb, aa]
}

let byte3 = {

}

let mnmap = {
	"aci" : arg => ["ce", arg[1]],
	"adc" : arg => adc[arg[1]] ? adc[arg[1]] : [],
	"add" : arg => add[arg[1]] ? add[arg[1]] : [],
	"adi" : arg => ["c6", arg[1]],
	"ana" : arg => ana[arg[1]] ? ana[arg[1]] : [],
	"ani" : arg => ["e6", arg[1]],
	"call": arg => ["cd", littleEndian(arg[1])],
	"cc"  : arg => ["dc", littleEndian(arg[1])],
	"cnc" : arg => ["d4", littleEndian(arg[1])],
	"cp"  : arg => ["f4", littleEndian(arg[1])],
	"cm"  : arg => ["fc", littleEndian(arg[1])],
	"cma" : "2f",
	"cmc" : "3f",
	"cpe" : arg => ["ec", littleEndian(arg[1])],
	"cpo" : arg => ["e4", littleEndian(arg[1])],
	"cpi" : arg => ["fe", arg[1]],
	"cz"  : arg => ["cc", littleEndian(arg[1])],
	"cnz" : arg => ["c4", littleEndian(arg[1])],
	"daa" : "27",
	"dad" : arg => [dad[arg[1]]],
	"dcr" : arg => [dcr[arg[1]]],
	"dcx" : arg => [dcx[arg[1]]],
	"di"  : "f3",
	"ei"  : "fb",
	"hlt" : "76",
	"in"  : arg => ["db", arg[1]],
	"inr" : arg => [inr[arg[1]]],
	"inx" : arg => [inx[arg[1]]],
	"jmp" : arg => ["c3", littleEndian(arg[1])],
	"jc"  : arg => ["da", littleEndian(arg[1])],
	"jnc" : arg => ["d2", littleEndian(arg[1])],
	"jp"  : arg => ["f2", littleEndian(arg[1])],
	"jm"  : arg => ["ec", littleEndian(arg[1])],
	"jpe" : arg => ["ea", littleEndian(arg[1])],
	"jpo" : arg => ["e2", littleEndian(arg[1])],
	"jz"  : arg => ["ca", littleEndian(arg[1])],
	"jnz" : arg => ["c2", littleEndian(arg[1])],
	"lda" : arg => ["3a", littleEndian(arg[1])],
	"ldax": arg => [ldax[arg[1]]],
	"lhld": arg => ["2a", littleEndian(arg[1])],
	"mov" : function(args){
		// TODO: syntax checking

		let source = args[2], dest = args[1]
		let isregS = isRegisterName(source)
		let isregD = isRegisterName(dest)

		if(isregS){
			if(isregD){
				return [mov[source][dest.charCodeAt(0) - aCharCode]]
			} else {
				return [mov[source][9]]
			}
		} else {
			return [mov["m"][dest.charCodeAt(0) - aCharCode]]
		}
	},
	"nop"  : "00",
	"out"  : arg => ["db", arg[1]],
	"pchl" : "e9",
	"ral"  : "17",
	"rar"  : "1f",
	"rlc"  : "07",
	"rrc"  : "0f",
	"ret"  : "c9",
	"rc"   : "d8",
	"rnc"  : "d0",
	"rp"   : "f0",
	"rm"   : "f8",
	"rpe"  : "e8",
	"rpo"  : "e0",
	"rz"   : "c8",
	"rnz"  : "c0",
	"rim"  : "20",
	"sbi"  : arg => ["de", arg[1]],
	"sui"  : arg => ["d6", arg[1]],
	"shld" : arg => ["22", littleEndian(arg[1])],
	"sim"  : arg => "30",
	"sphl" : "f9",
	"sta" : arg => ["32", littleEndian(arg[1])],
	"stc"  : "37",
	"xchg" : "eb",
	"xri"  : arg => ["ee", arg[1]],
	"xthl" : "e3"
}

function parse(str){
	let time = Date.now()
	let lines = str.split("\n")
	let lineNumber = 1
	let code =[]

	for(let line of lines){
		line = line.trim()
		if(line === ""){
			lineNumber++
			continue;
		}

		let p = parseLine(line)
		code.push({
			code : p,
			bytes : p.length,
			lineNumber
		})
		lineNumber ++
	}
	let t2 = Date.now()
	console.log("time :" + (t2 - time))
	return code
}

function parseLine(line){
	let toks = line.trim().replace(", ", ",").toLowerCase().split(/,|\s|#/)
	// TODO: Remove unnecessary comments from the line.
	let fn = mnmap[toks[0]]
	let opcode
	if(typeof fn === "function"){
		opcode = mnmap[toks[0]](toks)
	} else if(fn === "array"){
		opcode = fn
	} else {
		opcode = [fn]
	}

	return opcode
}

let isRegisterName = (reg) => "abcdehl".indexOf(reg) !== -1
let i2h = i => i
let h2i = h => i
let aCharCode = "a".charCodeAt(0)

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
	"adi" : arg => ["c6", arg[1]],
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
	"di"  : "f3",
	"ei"  : "fb",
	"hlt" : "76",
	"in"  : arg => ["db", arg[1]],
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
	"shld" : arg => ["22", littleEndian(arg[1])],
	"sim"  : arg => "30",
	"sphl" : "f9",
	"sta" : arg => ["32", littleEndian(arg[1])],
	"stc"  : "37",
	"xchg" : "eb",
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
	let toks = line.trim().replace(", ", ",").split(/,|\s|#/)
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

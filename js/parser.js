
let isRegisterName = (reg) => "abcdehl".indexOf(reg) !== -1
let registerIndex = reg => "abcdehlm".indexOf(reg)
let addArg1 = mn => arg=> [mn, arg[1]]
let addArg2 = mn => arg=> [mn, littleEndian(arg[1])]
let addMap  = arg=> [mnemonics[arg[0]][registerIndex(arg[1])]]


let aCharCode = "a".charCodeAt(0)

function littleEndian(str){
	if(str.length !== 4)
		return str;
	let aa = str.charAt(0) + str.charAt(1)
	let bb = str.charAt(2) + str.charAt(3)
	return [bb, aa]
}

let mnemonics = {
    	// a,	b,	  c		d	  e		h	  l		m
	add: ["87", "80", "81", "82", "83", "84", "85", "86"],
	adc: ["8f", "88", "89", "8a", "8b", "8c", "8d", "8e"],
	ana: ["a7", "a0", "a1", "a2", "a3", "a4", "a5", "a6"],
	cmp: ["bf", "b8", "b9", "ba", "bb", "bc", "bd", "be"],
	dcr: ["3d", "05", "0d", "15", "1d", "25", "2d", "35"],
    inr: ["3c", "04", "0c", "14", "1c", "24", "2c", "34"],
    mov : 
    [
	    ["7f", "78", "79", "7a", "7b", "7c", "6f", "77"],
    	["47", "40", "41", "42", "43", "44", "45", "70"],
    	["41", "48", "49", "4a", "4b", "4c", "4d", "71"],
		["57", "50", "51", "52", "53", "54", "55", "72"],
		["5f", "58", "59", "5a", "5b", "5c", "5d", "73"],
		["67", "60", "61", "62", "63", "64", "65", "74"],
		["7d", "68", "69", "6a", "6b", "6c", "6d", "75"],
		["7e", "46", "4e", "56", "5e", "66", "6e"]
    ],
    mvi:["3e", "06", "0e", "16", "1e", "26", "2e", "36"],
	ora:["b7", "b0", "b1", "b2", "b3", "b4", "b5", "b6"],
	rst:["c7", "cf", "d7", "df", "e7", "ef", "f7", "ff"],
	sub:["97", "90", "91", "92", "93", "94", "95", "96"],
	sbb:["9f", "98", "99", "9a", "9b", "9c", "9d", "9e"],
	xra:["af", "a8", "a9", "aa", "ab", "ac", "ad", "ae"],
}

let dad = {bc: "09", de: "19", hl: "29", sp:"39"}
let dcx = {bc: "0b", de: "1b", hl: "2b", sp:"3b"}
let inx = {bc: "03", de: "13", hl: "23", sp:"33"}
let ldax = {bc: "0a", de: "1a"}
let lxi = { b : '01', d: '11', h:'21', sp : '31' }
let stax = { b : '02', d : '12' }
let push = { b : 'c5', d : 'd5', h: 'e5', psw : 'f5' }
let pop = { b : 'c1', d : 'd1', h: 'e1', psw : 'f1' }

let mnmap = {
	"aci"  : addArg1("ce"),
	"adc"  : addMap,
	"add"  : addMap,
	"adi"  : addArg1("c6"),
	"ana"  : addMap,
	"ani"  : addArg1("e6"),
	"call" : addArg2("cd"),
	"cc"   : addArg2("dc"),
	"cnc"  : addArg2("d4"),
	"cp"   : addArg2("f4"),
	"cm"   : addArg2("fc"),
	"cma"  : "2f",
	"cmc"  : "3f",
	"cpe"  : addArg2("ec"),
	"cpo"  : addArg2("e4"),
	"cpi"  : addArg1("fe"),
	"cz"   : addArg2("cc"),
	"cnz"  : addArg2("c4"),
	"daa"  : "27",
	"dad"  : arg => [dad[arg[1]]],
	"dcr"  : addMap,
	"dcx"  : arg => [dcx[arg[1]]],
	"di"   : "f3",
	"ei"   : "fb",
	"hlt"  : "76",
	"in"   : addArg1("db"),
	"inr"  : addMap,
	"inx"  : arg => [inx[arg[1]]],
	"jmp"  : addArg2("c3"),
	"jc"   : addArg2("da"),
	"jnc"  : addArg2("d2"),
	"jp"   : addArg2("f2"),
	"jm"   : addArg2("ec"),
	"jpe"  : addArg2("ea"),
	"jpo"  : addArg2("e2"),
	"jz"   : addArg2("ca"),
	"jnz"  : addArg2("c2"),
	"lda"  : addArg2("3a"),
	"ldax" : arg => [ldax[arg[1]]],
	"lhld" : addArg2("2a"),
	"lxi"  : arg => [lxi[arg[1]], littleEndian(arg[2])],
	"mov"  : arg => mnemonics.mov[registerIndex(arg[2])][registerIndex(arg[1])],
	mvi    : arg => [mnemonics.mvi[registerIndex(arg[1])], arg[2]],
	"nop"  : "00",
	ora    : addMap,
	"out"  : addArg1("d3"),
	"pchl" : "e9",
	push   : arg => [push[arg[1]]],
	pop    : arg => [pop[arg[1]]],
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
	rst    : arg => mnemonics.rst[arg[1]],
	sbb    : addMap,
	"sbi"  : addArg1("d3"),
	sub    : addMap,
	"sui"  : addArg1("d6"),
	"shld" : addArg2("22"),
	"sim"  : "30",
	"sphl" : "f9",
	"sta"  : addArg2("32"),
	stax   : arg => [stax[arg[1]]],
	"stc"  : "37",
	"xchg" : "eb",
	"xri"  : addArg1("ee"),
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

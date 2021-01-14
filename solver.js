const { Struct } = require("struct");

var lit;
var clauses = [];
var myVector = [];
var trail = [];
var t = [];
var p = {};

module.exports = {

    solve: function(req,res, next) {
        var resp = parse(req.files);
        res.status(200).send(resp);
    },
    
    
};

parse = (files) => {
    var filename = files.cnf.data.toString('ascii');
    //console.log(clauses);
    myVector = [];
    trail = [];
    clauses = [];
    t = [];
    p = {};

    parse_dimacs(filename);
    for(var i=1;i<=lit;i++){
        myVector.push(10);
    }
    //console.log(lit);
    if(DPLL(clauses)){
        return "SAT";
        console.log("SAT");
    }
    else {
        return "UNSAT";
        console.log("UNSAT");
    }
}

parse_dimacs = (filename)=>{
    var lines;


    lines = filename.split("\n");

    for(var i=0; i<lines.length;i++){
        if(lines[i] == "") continue;
        if(lines[i][0] == "c") continue;
        if(lines[i][0] == "p") {
            lit = lines[i].split(" ")[3];
            continue;
        }
            var numbers = lines[i].split(' ');
            var clause = [];
            for(var j=0; j<numbers.length;j++){
                var number = parseInt(numbers[j]);
                if(number == 0) break;
                clause.push(number);
            }
            clauses.push(clause);
    }
}

BCP = (clauses) =>{
    for(var i=0; i<clauses.length;i++){
        var c = 0;
        var myValue = 0;
        var flag = 0;
        var row = clauses[i].length;
        for (var j=0; j<row; j++){
            var index = Math.abs(clauses[i][j]);
            if (clauses[i][j]>0 && myVector[index]==1){
                flag =1;
            }
            else if(clauses[i][j]<0 && myVector[index]==0) {
                flag = 1;
            }
        }
        if(flag == 1){
            continue;
        }
        for(var j=0;j<row;j++){
            var index = Math.abs(clauses[i][j]);
            var flag2 = 0;
            if(myVector[index]!=10){
                c++;
            }
            else{
                myValue = clauses[i][j];
            }
        }
        if(c==row-1){
            if(myValue>0){
                t = {x: myValue, v: 1, b: true};
                trail.push(t);
                myVector[t.x] = 1;
            }
            else if(myValue<0){
                t = {x: Math.abs(myValue), v: 0, b: true};
                trail.push(t);
                myVector[t.x] = 0;
            }
        }
        else if(c==row) return false;
    }
    return true;
}

decide = () =>{
    if(trail.length == 0){
        t = {x: 1, v: 0, b: false};
        trail.push(t);
        myVector[t.x] = 0;
        return true;
    }
    for(var i=1;i<=lit;i++){
        var flag=0;
        for(var j=0;j<trail.length;j++){
            if(trail[j].x==i) flag=1;
        }
        if(flag==0) {
            t = {x: i, v: 0, b: false};
            trail.push(t);
            myVector[t.x] = 0;
            return true;
        }
    }
    return false;
}

backtrack = () =>{
    while(true){
        if(trail.length == 0){
            return false;
        }
        p=trail[trail.length -1];
        trail.pop();
        myVector[p.x]=10;
        if(!p.b && p.v==0){
            p.v=1;
            p.b=true;
            trail.push(p);
            myVector[p.x]=1;
            return true;
        }
        else if(!p.b && p.v==1){
            p.v=0;
            p.b=true;
            trail.push(p);
            myVector[p.x]=0;
            return true;
        }
    }
}

DPLL = (clauses)=>{
    while(trail.length>0){
        trail.pop();
    }
    if(!BCP(clauses)){
        console.log("BCP FALSE")
        return false;
    } 
    while(true){
        if(!decide()){
            return true;
        }
        while(!BCP(clauses)){
            if(!backtrack()){
                console.log("BACK FALSE");
                return false;
            } 
        }     
    }
}
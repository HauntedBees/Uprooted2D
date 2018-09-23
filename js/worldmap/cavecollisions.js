const cavecollisions = 
[
[[0,0,1,1,0]
,[0,0,1,1,0]
,[0,2,1,2,0]
,[0,1,1,0,0]
,[0,1,1,0,0]
]
,
[[0,0,0,0,0]
,[0,2,1,0,0]
,[2,1,1,0,0]
,[1,1,0,0,1]
,[1,0,0,1,1]
]
,
[[0,0,0,1,1]
,[1,1,0,1,1]
,[1,1,0,0,0]
,[2,1,0,0,0]
,[1,1,0,0,0]
]
,
[[0,0,0,1,1]
,[0,0,0,2,1]
,[3,0,0,0,0]
,[1,1,0,0,0]
,[1,1,0,0,0]
]
,
[[1,1,0,1,1]
,[1,2,0,0,0]
,[0,1,1,0,0]
,[0,0,0,0,1]
,[0,0,0,1,1]
]
,
[[0,1,1,0,0]
,[1,1,0,0,0]
,[1,2,0,0,0]
,[1,1,0,0,0]
,[0,1,0,0,0]
]
,
[[0,1,0,1,0]
,[1,1,2,1,1]
,[0,2,0,2,0]
,[1,1,2,1,1]
,[0,1,0,1,0]
]
,
[[0,0,0,0,0]
,[0,1,1,1,0]
,[0,1,2,1,0]
,[0,1,3,1,0]
,[0,0,0,0,0]
]
,
[[0,0,3,1,1]
,[1,1,0,2,1]
,[1,1,0,0,0]
,[2,1,1,1,0]
,[0,0,0,0,0]
]
,
[[1,1,0,0,1]
,[1,1,0,0,1]
,[0,0,3,0,0]
,[0,0,0,0,0]
,[1,1,0,0,1]
]
,
[[0,0,1,0,0]
,[0,0,1,0,0]
,[0,1,1,1,0]
,[0,0,1,0,0]
,[0,0,0,0,0]
]
,
[[1,1,0,0,0]
,[1,1,0,0,0]
,[0,0,0,0,0]
,[0,0,0,2,1]
,[0,0,0,1,1]
]
,
[[0,1,0,0,0]
,[0,1,1,1,1]
,[0,3,0,2,1]
,[0,1,1,1,1]
,[0,1,0,0,0]
]
,
[[0,0,0,0,0]
,[1,1,0,0,0]
,[3,1,0,0,0]
,[0,0,0,1,1]
,[0,0,0,1,3]
]
,
[[0,0,0,0,0]
,[0,1,0,1,0]
,[0,0,0,0,0]
,[1,0,0,0,1]
,[2,1,1,1,2]
]
,
[[0,1,0,1,0]
,[1,2,0,1,1]
,[1,1,0,1,1]
,[1,1,0,2,1]
,[0,1,0,1,0]
]
,
[[0,0,0,0,0]
,[1,1,0,0,1]
,[1,2,0,0,1]
,[1,0,0,0,1]
,[0,0,0,0,0]
]
,
[[0,0,0,0,0]
,[1,2,1,2,1]
,[1,3,1,3,1]
,[1,2,1,2,1]
,[0,0,0,0,0]
]
,
[[1,1,0,0,0]
,[1,2,0,0,0]
,[0,0,1,1,0]
,[0,0,1,2,0]
,[0,0,0,0,0]
]
,
[[2,1,1,1,1]
,[0,0,0,0,0]
,[0,0,0,0,0]
,[1,1,1,0,0]
,[0,0,0,0,1]
]
,
[[0,1,0,0,0]
,[0,1,0,1,1]
,[0,0,0,0,0]
,[0,1,1,1,1]
,[0,0,1,1,0]
]
,
[[1,0,3,0,1]
,[0,1,2,1,0]
,[3,2,1,2,3]
,[0,1,2,1,0]
,[1,0,3,0,1]
]
,
[[0,0,0,0,0]
,[1,1,1,1,1]
,[1,1,0,3,0]
,[0,3,0,1,1]
,[1,1,1,1,1]
]
,
[[1,0,0,0,1]
,[1,1,2,1,1]
,[0,0,1,0,0]
,[0,1,1,1,0]
,[0,0,1,0,0]
]
,
[[0,0,0,0,0]
,[1,1,0,0,0]
,[1,1,1,0,0]
,[1,1,1,1,0]
,[2,1,1,1,0]
]
,
[[0,0,1,1,2]
,[0,0,1,1,1]
,[0,1,1,1,0]
,[0,1,1,0,0]
,[0,0,0,0,0]
]
,
[[0,0,0,0,0]
,[0,1,1,2,0]
,[0,1,1,1,0]
,[0,0,1,1,0]
,[0,0,0,0,0]
]
,
[[0,0,0,0,0]
,[1,1,1,0,0]
,[1,1,2,1,0]
,[0,0,0,1,0]
,[0,0,1,0,0]
]
,
[[0,0,1,0,0]
,[1,0,2,1,0]
,[3,0,1,2,0]
,[1,0,2,1,0]
,[0,0,1,0,0]
]
,
[[1,1,0,1,1]
,[1,2,0,1,2]
,[1,1,3,1,1]
,[1,0,0,1,0]
,[1,0,0,1,0]
]
,
[[0,0,0,1,1]
,[1,2,0,2,1]
,[1,1,0,0,0]
,[0,0,0,0,0]
,[0,0,1,1,0]
]
,
[[1,1,0,0,1]
,[1,0,0,0,0]
,[0,0,1,1,0]
,[1,1,1,2,0]
,[1,1,2,0,0]
]
,
[[1,1,0,1,1]
,[1,3,0,0,1]
,[0,0,1,0,0]
,[1,0,0,0,1]
,[1,1,0,1,1]
]
,
[[1,1,1,1,1]
,[1,1,1,1,1]
,[1,1,2,0,3]
,[1,1,1,1,1]
,[1,1,1,1,1]
]
,
[[0,0,1,0,0]
,[1,1,1,1,0]
,[1,1,1,1,1]
,[2,1,1,1,1]
,[2,1,1,1,2]
]
,
[[1,0,0,0,0]
,[0,0,1,1,0]
,[0,1,1,1,2]
,[0,1,1,1,1]
,[0,0,2,1,1]
]
,
[[0,1,1,1,1]
,[0,0,1,1,1]
,[0,0,0,1,2]
,[1,1,1,1,1]
,[2,1,1,1,1]
]
,
[[0,1,0,1,0]
,[0,1,0,1,0]
,[0,0,0,0,0]
,[0,1,1,1,0]
,[0,1,2,1,0]
]
,
[[0,0,0,0,1]
,[1,0,0,0,0]
,[0,0,0,0,0]
,[0,1,1,1,1]
,[0,1,2,1,2]
]
,
[[0,0,0,1,0]
,[1,1,1,1,0]
,[0,1,1,1,0]
,[0,1,1,1,1]
,[0,1,0,0,0]
]
,
[[0,0,1,1,1]
,[0,0,1,2,1]
,[0,3,1,3,0]
,[1,2,1,0,0]
,[1,1,1,0,0]
]
,
[[1,1,0,1,1]
,[1,1,0,1,1]
,[0,0,0,0,0]
,[1,0,3,0,1]
,[1,1,1,1,1]
]
,
[[1,0,1,0,1]
,[1,2,1,2,1]
,[1,1,1,1,1]
,[0,2,1,2,0]
,[0,0,1,0,0]
]
,
[[0,0,1,3,1]
,[1,0,1,1,1]
,[1,0,0,0,0]
,[1,0,1,1,1]
,[0,0,1,3,1]
]
,
[[2,1,0,0,1]
,[1,0,1,1,2]
,[1,3,0,2,1]
,[1,0,1,1,1]
,[1,0,0,1,0]
]
,
[[1,1,0,1,2]
,[0,1,0,1,1]
,[0,0,0,1,2]
,[1,0,0,0,1]
,[1,1,1,1,1]
]
,
[[0,1,1,0,0]
,[0,1,1,1,0]
,[3,2,1,1,1]
,[1,1,1,0,1]
,[2,1,1,0,0]
]
,
[[0,1,0,0,0]
,[0,1,0,0,0]
,[0,1,0,0,0]
,[1,1,1,1,1]
,[0,1,0,0,0]
]
,
[[0,1,1,1,0]
,[1,1,1,1,1]
,[1,1,1,1,1]
,[1,1,1,1,1]
,[0,1,1,1,0]
]
,
[[0,0,0,0,0]
,[0,1,3,1,0]
,[0,3,2,3,0]
,[0,0,1,0,0]
,[0,0,0,0,0]
]
,
[[1,1,1,1,1]
,[1,2,0,0,1]
,[1,0,0,0,1]
,[1,1,1,3,1]
,[1,0,0,0,1]
]
,
[[1,1,1,0,1]
,[1,0,0,0,1]
,[1,0,1,1,1]
,[1,0,0,0,0]
,[1,1,1,1,1]
]
,
[[1,0,0,1,1]
,[1,1,0,3,1]
,[0,0,0,0,0]
,[1,1,0,1,0]
,[0,1,0,1,1]
]
,
[[0,0,1,0,0]
,[0,0,1,0,0]
,[0,0,1,0,0]
,[0,1,1,1,0]
,[1,2,1,2,1]
]
,
[[1,0,0,0,1]
,[1,1,0,0,1]
,[1,1,0,3,1]
,[0,0,1,2,1]
,[0,0,0,1,1]
]
,
[[1,0,1,1,1]
,[1,0,1,2,1]
,[1,3,1,3,1]
,[1,2,1,0,1]
,[1,1,1,0,1]
]
]
;
const cavecollisionsMed = 
[
[[0,0,0,0,0,0,0,0,0,0,0]
,[0,1,1,1,0,0,0,1,1,1,0]
,[0,3,2,1,0,1,0,1,2,3,0]
,[0,1,1,1,0,0,0,1,1,1,0]
,[0,0,0,0,0,0,0,0,0,0,0]
,[0,1,1,1,1,1,1,1,1,1,0]
,[0,1,1,2,1,2,1,2,1,1,0]
,[0,1,0,0,1,0,1,0,0,1,0]
,[0,1,0,0,1,3,1,0,0,1,0]
,[0,1,1,3,0,0,0,3,1,1,0]
,[0,0,0,0,1,1,1,0,0,0,0]
]
,
[[0,1,1,1,0,0,1,0,0,0,0]
,[1,0,1,0,0,0,1,0,0,0,0]
,[1,0,1,1,0,0,0,1,0,0,0]
,[1,1,0,0,0,0,1,1,1,1,0]
,[0,0,0,0,0,0,0,0,0,0,0]
,[0,1,1,0,1,1,1,0,0,0,0]
,[1,1,1,0,1,1,0,1,1,1,0]
,[1,1,1,0,0,0,0,1,1,1,1]
,[0,1,0,0,0,0,0,0,1,0,0]
,[0,0,0,2,0,0,2,0,0,0,0]
,[0,0,0,0,0,0,0,0,0,0,0]
]
,
[[1,1,1,1,1,1,1,1,1,0,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,1,1,1,1,1,1,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,1,0,1,0,1,0,1]
,[1,0,0,0,1,9,1,0,0,0,1]
,[1,0,1,0,1,1,1,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,1,1,1,1,1,1,0,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,1,1,1,1,1,1,1,1,1]
]
,
[[0,0,0,1,1,1,1,1,0,0,0]
,[0,0,1,0,0,0,0,0,1,0,0]
,[0,1,0,0,1,2,1,0,0,1,0]
,[0,1,0,0,0,0,0,0,0,1,0]
,[0,1,0,1,0,0,0,1,0,1,0]
,[0,1,0,0,1,1,1,0,0,1,0]
,[0,1,0,0,0,0,0,0,0,1,0]
,[0,1,0,0,0,0,0,0,0,1,0]
,[0,1,0,0,0,0,0,0,0,1,0]
,[0,1,3,1,1,1,1,1,3,1,0]
,[0,1,0,1,0,1,0,1,0,1,0]
]
,
[[0,0,1,0,0,0,0,0,1,0,0]
,[0,0,0,1,0,0,0,1,0,0,0]
,[0,0,1,1,3,1,3,1,1,0,0]
,[0,1,0,0,0,0,0,0,0,1,0]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,1,1,1,1,1,1,1,0,1]
,[1,0,1,2,0,0,0,3,0,0,1]
,[1,0,0,1,1,1,1,1,0,0,1]
,[0,1,0,0,0,0,0,0,0,1,0]
,[0,0,1,1,0,0,0,1,1,0,0]
,[0,0,0,0,1,1,1,0,0,0,0]
]
,
[[3,0,0,0,0,0,0,0,0,0,0]
,[1,1,0,1,1,1,1,1,0,1,1]
,[0,0,0,0,0,0,0,0,0,0,5]
,[1,1,1,1,1,0,1,1,1,1,1]
,[3,0,0,0,0,0,0,0,0,0,0]
,[1,0,1,1,1,1,1,1,1,0,1]
,[0,0,0,0,0,0,0,0,0,0,5]
,[1,1,1,0,1,1,1,0,1,1,1]
,[3,0,0,0,0,0,0,0,0,0,0]
,[0,1,1,1,1,1,1,1,1,1,0]
,[0,0,0,0,0,0,0,0,0,0,5]
]
,
[[0,0,0,1,1,1,1,1,1,0,0]
,[0,0,1,0,0,0,0,0,0,1,0]
,[0,1,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,1,1,0,0,0,1]
,[1,0,0,0,1,0,2,1,0,0,3]
,[1,0,0,0,3,0,2,1,0,0,0]
,[1,0,0,0,1,0,2,1,0,0,0]
,[1,0,0,0,0,1,1,0,0,0,1]
,[0,1,0,0,0,0,0,0,0,0,1]
,[0,0,1,0,0,0,0,0,0,1,0]
,[0,0,0,1,1,1,1,1,1,0,0]
]
,
[[1,1,1,1,1,1,1,1,1,1,1]
,[1,5,0,5,0,5,0,5,0,0,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[0,0,0,0,0,0,0,0,0,9,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,0,0,0,0,0,1]
,[1,0,3,0,3,0,3,0,3,0,1]
,[1,1,1,1,1,1,1,1,1,1,1]
]
,
[[0,1,1,1,1,1,1,0,1,1,0]
,[1,0,0,0,1,0,0,0,0,0,1]
,[1,0,1,0,1,0,1,1,1,0,1]
,[1,0,1,0,1,0,0,0,1,0,1]
,[1,0,1,0,1,1,1,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,1,1,1,0,1,0,1]
,[1,0,1,0,1,2,0,0,1,0,1]
,[1,0,1,0,1,1,1,1,1,0,1]
,[1,2,1,0,0,0,2,1,2,0,1]
,[0,1,1,1,1,1,1,1,1,1,0]
]
,
[[0,1,1,3,1,1,1,0,1,1,0]
,[0,1,2,0,1,2,1,0,2,1,0]
,[0,1,1,0,0,0,0,0,1,1,0]
,[0,0,0,0,1,1,1,0,0,0,0]
,[0,1,1,0,1,2,1,0,1,1,0]
,[0,1,2,0,0,0,0,0,2,1,0]
,[0,1,1,0,1,2,1,0,1,1,0]
,[0,0,0,0,1,1,1,0,0,0,0]
,[0,1,1,0,0,0,0,0,1,1,0]
,[0,1,2,0,1,2,1,0,2,1,0]
,[0,1,1,0,1,1,1,5,1,1,0]
]
,
[[0,1,2,0,0,1,0,0,2,1,0]
,[0,1,0,0,1,9,1,0,0,1,0]
,[0,0,0,1,0,0,0,1,0,0,0]
,[0,0,1,0,0,0,0,0,1,0,0]
,[0,0,1,0,0,0,0,0,1,0,0]
,[0,0,0,0,1,0,1,0,0,0,0]
,[0,1,0,0,0,0,0,0,0,1,0]
,[1,0,0,1,1,1,1,1,0,0,1]
,[1,0,0,0,1,1,1,0,0,0,1]
,[0,1,0,0,0,0,0,0,0,1,0]
,[0,0,1,1,1,1,1,1,1,0,0]
]
,
[[0,1,1,1,1,1,1,1,1,1,0]
,[0,1,0,0,0,0,0,0,2,1,0]
,[0,0,0,0,0,0,0,0,1,0,0]
,[0,0,0,0,0,0,0,1,0,0,0]
,[0,0,0,0,1,1,1,0,0,0,0]
,[0,0,1,1,1,1,1,1,1,0,0]
,[0,0,0,0,1,1,1,0,0,0,0]
,[0,0,0,1,0,0,0,0,0,0,0]
,[0,0,1,0,0,0,0,0,0,0,0]
,[0,1,2,0,0,0,0,0,0,1,0]
,[0,1,1,1,1,1,1,1,1,1,0]
]
]
;
const cavecollisionsBoss = 
[
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
,[1,0,1,1,1,0,1,1,1,0,0,2,0,0,1,1,1,0,1,1,1,0,1]
,[1,0,1,3,0,0,0,0,1,0,0,1,0,0,1,3,0,0,0,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,0,0,0,9,0,0,0,0,0,1,0,0,0,0,0,9,0,0,0,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,0,0,0,5,1,0,0,1,0,0,1,0,0,0,0,5,1,0,1]
,[1,0,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,0,1]
,[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1]
,[1,0,2,1,1,1,1,1,0,1,11,0,12,1,0,1,1,1,1,1,2,0,1]
,[1,0,0,0,0,0,0,0,0,0,1,10,1,0,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
,[1,0,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,0,1]
,[1,0,1,3,0,0,0,0,1,0,0,0,0,0,1,3,0,0,0,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,0,0,0,9,0,0,0,0,0,0,0,0,0,0,0,9,0,0,0,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,0,0,0,5,1,0,0,0,0,0,1,0,0,0,0,5,1,0,1]
,[1,0,1,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,0,1]
,[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1]
,[1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1]
]
,
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,2,1,0,0,0,1,1,1,2,1,0,0,0,0,0,0,1,1,2,1,1]
,[1,1,0,0,0,1,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,1,1]
,[1,1,0,1,1,1,1,1,1,1,1,1,10,1,1,0,1,1,1,1,1,1,1]
,[1,1,0,0,0,0,0,2,1,0,0,12,0,0,1,0,0,0,0,0,0,1,1]
,[1,1,0,1,1,1,1,1,1,0,0,0,0,0,1,1,1,1,1,1,0,1,1]
,[1,1,0,0,0,2,1,2,1,0,0,11,0,0,1,2,0,0,0,1,0,1,1]
,[1,1,0,1,1,1,1,0,1,0,0,0,0,0,1,1,1,1,0,1,0,1,1]
,[1,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,2,1,0,1,0,1,1]
,[1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1]
,[1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,1]
,[1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1]
,[1,1,0,1,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,1]
,[1,1,0,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,0,1,1,1]
,[1,1,0,1,0,1,0,1,2,1,0,1,0,1,0,0,0,2,1,0,0,1,1]
,[1,1,0,0,0,1,0,1,0,1,2,1,0,1,0,1,1,1,1,1,0,1,1]
,[1,1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,2,1,0,0,0,1,1]
,[1,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,1,1,1,1]
,[1,1,0,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,2,1,1]
,[1,1,0,0,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,0,0,1,1]
,[1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1]
,[1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1,1]
]
,
[[0,1,0,0,1,1,1,1,0,1,1,1,1,1,1,1,0,0,1,0,1,1,1]
,[1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1]
,[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0]
,[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,11,1,12,1,1,0]
,[1,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,0,0,10,0,0,0]
,[0,1,1,1,0,0,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,0,1]
,[0,0,0,0,1,1,3,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1]
,[1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1]
,[1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1]
,[1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,0,1]
,[1,0,0,0,0,0,1,0,0,0,9,0,0,1,0,0,0,1,0,1,1,0,0]
,[0,0,1,1,0,0,0,1,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0]
,[0,1,0,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1]
,[1,1,0,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,1,0]
,[3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1]
,[1,1,0,0,1,0,0,0,0,0,0,0,1,1,1,1,3,0,0,0,0,0,1]
,[0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1]
,[0,1,0,0,0,1,1,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1]
,[0,1,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0]
,[0,0,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,1]
,[1,0,0,1,0,0,1,0,1,0,1,0,9,0,0,0,0,1,0,0,0,0,1]
,[1,0,0,0,1,0,0,9,1,0,1,0,0,0,0,0,1,0,0,0,0,0,1]
,[1,1,1,0,0,1,1,1,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1]
]
,
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1]
,[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,1,1,1]
,[1,0,1,0,3,0,0,0,1,0,3,0,0,0,1,0,3,0,0,0,1,0,1]
,[1,0,1,0,0,2,0,0,0,0,0,2,0,0,0,0,0,2,0,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,1,1,0,1,1,1,1,1,10,1,1,1,1,1,0,1,1,1,0,1]
,[1,0,1,0,0,0,0,0,1,9,0,0,0,12,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,3,0,0,0,1,0,0,0,0,0,1,0,3,0,0,0,1,0,1]
,[1,0,1,0,0,2,0,0,1,0,0,11,0,0,1,0,0,2,0,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,0,1,0,3,0,0,0,0,0,3,0,0,0,0,0,3,0,0,0,1,0,1]
,[1,0,1,0,0,2,0,0,0,0,0,2,0,0,0,0,0,2,0,0,1,0,1]
,[1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1]
,[1,1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,1,1,1]
,[1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1]
,[1,1,1,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,1,1,1]
,[1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1]
]
,
[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,0,0,0,1,1,1,1,1,9,11,12,1,1,1,1,1,9,9,9,1,1]
,[1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1]
,[1,1,1,1,1,1,1,1,1,1,1,10,1,1,1,1,1,1,1,0,1,1,1]
,[1,1,4,0,0,1,4,0,0,1,0,0,0,1,0,9,0,1,4,0,0,1,1]
,[1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,1]
,[1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1]
,[1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,0,0,0,1,4,0,0,1,0,9,0,1,0,0,0,1,0,0,0,1,1]
,[1,1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,9,1,0,0,0,1,1]
,[1,1,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,1]
,[1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,0,0,0,1,1,1,0,3,0,0,0,0,0,1,1,1,9,0,9,1,1]
,[1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1]
,[1,1,0,0,0,1,1,1,0,0,1,1,1,0,0,1,1,1,0,0,0,1,1]
,[1,1,9,0,9,1,1,1,0,0,0,0,0,5,0,1,1,1,0,0,0,1,1]
,[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1]
,[1,1,1,0,0,0,0,0,1,4,0,4,0,0,1,0,0,0,0,0,1,1,1]
,[1,1,1,0,9,0,0,0,0,0,0,0,0,0,0,0,1,9,1,0,1,1,1]
,[1,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,1]
,[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1]
,[1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1]
]
,
[[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0]
,[0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0]
,[0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0]
,[0,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,0]
,[0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,0]
,[1,1,1,1,1,1,1,1,1,1,1,1,1,0,2,1,0,0,1,1,1,1,1]
,[1,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,1,1,1,1,1]
,[1,1,0,0,0,2,1,1,1,10,1,1,1,1,1,1,0,0,1,2,0,1,1]
,[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1]
,[1,0,0,1,0,1,1,0,9,0,0,9,0,1,0,1,1,0,0,1,0,0,1]
,[1,0,0,1,0,0,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1]
,[1,0,0,1,0,1,1,12,1,1,0,0,0,0,0,1,0,0,0,1,0,0,1]
,[1,0,0,1,0,0,1,1,0,0,0,0,0,0,1,1,1,0,0,1,0,0,1]
,[1,1,0,0,1,0,2,1,0,0,11,0,0,1,0,1,2,0,1,0,0,1,1]
,[1,1,1,0,0,1,1,0,1,1,1,1,1,0,0,0,1,1,0,0,1,1,1]
,[1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1]
,[1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,1,1,1]
,[1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1]
,[0,1,1,0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,1,0,0,1,0]
,[0,1,1,2,0,1,1,1,0,0,0,1,0,0,1,1,1,1,1,0,2,1,0]
,[0,0,1,1,1,1,1,1,0,0,1,1,0,0,1,1,1,1,1,1,1,0,0]
,[0,0,0,1,1,1,1,1,2,0,1,1,1,0,0,0,0,1,1,1,0,0,0]
,[0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,0,0]
]
]
;

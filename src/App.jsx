// import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AlternativeBlock from "./AlternativeBlock";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasProduct, setHasProduct] = useState(true);
  const [productInfo, setProductInfo] = useState({});
  const [altInfo, setAltInfo] = useState([
    // {
    //   imgLink:
    //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAABHVBMVEX///8AAACMAzfgEAAyODk5ZG+AyN72+/2PAziRAznkEAApMDF7fn6KAziGATmioqLqEQBdAiSEzuVnAih7xt07aHOiBy8AAwB5eXlmZmby8vJwAywvNTYgKCnj4+Pu7u40XmhQBSCXl5fU1NTU6/NKe4ktTlaUBTR4BC8THR+GhoYSEhLLy8uoqKhZWVm7DQy/DCDZDw0kP0VHAxyyCidKBR4IFhhDQ0MeHh61tbVRBQhhBwV2CAXIDgqlDAdtbW1xsMSp2OgdMjdWjJt1uM1fmaokBA/EDB0zBBUeBA2nCCxBBgaRCgcwAwZ+CQbAwMAEABFZBggXAQa43+yy3OqKCgB7CQgZKi/SDhM5Awi+DQg5Axe4CyQ6AR6uDA2IQzJ0AAANkElEQVR4nO2d+1vaShPHTQAlodAgoFYFAS+AeEMrShXRqng5tj217alHz+v//2e8m4S9ZjcEvKS78v2hfZSAzOeZ2Z2dnU3GxkYaaaSRRhpppD9Gs2vr5VWgmc6Hjb1oXetpf+/D6vrabNjf7k/S2sy+5qt6Z70Q9pf8M9Sq+5OCTrY64rWWD4TKUeL92w7ImeCoHM0shP2NQ9Ps3oCs3jCu2cFR2SqH/b3D0Gywkd2r/cWwv/rrywOh++ng+18j5+Jpg7b/cDNiOYo02u1NoHb7fvPo5vA7l9aHsL/966pMGX9jWmYEyiQE6LVvvnhpJSbCNuAVtUhafhDBpLwCxNqHHlr1sC14RZELnCPLB5XLy4p8ZWnth23Cq4kMwvu+rGxZDXbs3wvbiFfSAmFz2y8EKe86Ymi9C9uM11FncFa2c7UZWt/CtuM1VCBiMDgre6hnQvEtLKw/IGtvAo1XBK5PFKxO2Ja8vLBj/T2IX/ForYVty4trFdmabgwKK2IdkLASYdvy4sK2pgLAItJ558fImxrjvyFLSymfMHTXOmYDLBVdNYAikQadzKuebOEVtK7zYdmYIu2jw4N/tb5Su1yDS347RsULC4BqbP466PbH5Ert+kML2VlNXrOwTOv+K6fG4CelN31QknVlJLcYWNbmgKQ0xSdEVExOx5nJ0IzwK319NK/uFgbOSPUkPWSZkdthWGkKRyIasrpG8j86Cq/8gDRrNfEGh6qJPNpWLRl0FNKpOdLn4vL5cXbS1fjZ+WnsN+cqRROIKLQvE0+SjmWy9RdN246dHruMgLKOxsftH89zHmBqRiIyL6lTQxbjWCsup3FX2ezJyQ+gkxMHGiB2nKNhKVmSx+O7QcMyCctzZ5iToyXwzgkg+7+lpZNJm9f4MkVrJmzLXkBr0LgdIzlFwDLvCa9apkiNZydo2cR+ToJxjMKl4CC/Dm1Lx2lYj8jqz7kizern2IRXYxMn2cmzzxiWgsnpO2hblYF1g6yOxYrHFKwlDisb1xIIRsK51HMt1GSk6zSsX/CF7VwsdjoZANbE2E9A6xTBUq9aAy27MhhYaBM1BkTFYfaHANbEGHiVoKVa+oAKfzssLFjTa+ZibBxO8sYsRyd24lWEn6lWb80sLs+k4zpVoEFp1rYDi47Dn07OwPGsE+d1+JmKbOgXWp2ERikTpz0LwVrJOXFIJQ/Z7OTJzx9LSxM0NHuEpwIxbDOfroUy04nVmwwZz4LVmWIs5olDgKu33AHUQCq/5Ook23tVlfmwwCOl2ZMh41lwP9BxrFgsR+elBDWIzVkpumPaSu+978O29mnq8FFp0wYL6zsNq3guoMURikOplzwL0wJWWlcEq96DFStm+1OCsJYVgOXTuv3ggXXAwIotB2Z1DpMHmWHNi2GV4mwG/w8dhsC1AtICrGLywyqLSGlOmiVY7sSQirmzfuPW5OT48TKYP+WHxfD5m/xhzgMLLqRXYgSu0ywfl1M/zZ4dny8X7VRD/jBskXAO7yOW1dhE1VCQZulU8Q+VaLZjJK3i8vnZJKlxgOj4/Px0OVe05aYZK9LDIg4x3bbdLncTZVNJnYXV6L1Sy8ViNK9ibtlVLhcrQpGXoIq8vLAIv0J9o2hRozuiavDw4mJsUKGVtLSw1jAr3Odu9XpC7ZxU16mGI5SVsq7VV7nP0sNC9WPt1vK4z60Li2BFlEq3B6OFRixNWw/b6GGFeyF/EQ7U+1XXhUVusqJBCxYeBmclb/UPH+h9ND1ALl1Yd6RrWf8OQ4tkJW+JBrdvNzAsuN/14MK6oDYO8ZZFYFo5ai9f2iGLgEWcjXv0gRVpEHYHGrdyMWInTJO5nIVgfXHGd7fZGJ6+2XFgMV00Ftla+7svqVyRaXjIh23y8EKwvluAVOPiupJMpdI0rI90f1aDsn0lJ/Yu8NJKU2MkcZc3glWNmFuVVMrO2eMQ1q4La4qCFbHoM4VNES5AitN2JPOONIKVBHITdgzLrtAw6x0ys0DaLuZsYUrgh+J2zUtKk7tFC8GK60gsrCQDy9z0Mqh93l5x1oLF4srK9m8+KE3yTUMIy13Z8GGlGMeKWDciFv0kd38WhHXrB+vu2WhJ7VioQtMlYWUYWBfsoBWxHkU4/CXziIVhXfrAYtuV3QTikwgIoy83R3j6lLsXHsJ68IPlOY5i07IeA/TDf/natkzTQgcy5D4ADG8itsuDle5NkZyDTjYu88j3VMpfX48alnP6EHftSltwcATvclGK+8ASHKED3rXJ74q/Pbi5j1i9c5rEpr/E60JbGsuFB0t8ktW0Io//kKPX7afDm82GZZkk37v/wZflbnOAVmR8Yd35HmW1rEZ7c/PxcbPdsG+BZLIXm/+V4J+R+9ghtGLODxZvOmSJ4ePR3hc/wsRN7ka22WCweNNhcJnXcyhMZZ4OEayq7wDPnw4Dw5qqIlgyZ6Xo2ElV94PlWR0OBquSQrCk3dkZI24mlvSH5V3wDAIrlUSwVsO2+AlCPdy6LyymWDqg7lIGgiXzdIj2WA1fWE8atMyLlIF6C2U+X/G+Z8N0H1h+9wzpC+tjEnuWvJuGGFY/z/JNS/vBmkoaVyrB6vaB9ZRMy0zqRvctwRKupQPoLqUYrMt+sIaPQ3NLNc/qC2v4ODSvVYP10DcMh54PTfAhbwEWWREcOolvpFSDtUPBmuPAGjYvtYestwdrSNcCWRaApVSeFQDWsK4FolDHGbzMfSH8MYsPayjXcqJQx2vDjbAtfoL8YZH7Y/bvh4FV0SnPkvlmuPw8C8LaoWENU6ix50LwTgRL5noWf7kjgDVEGu8M7yQsmSulg8EaOBDNC8ex4rgGL3GTpKBEA2E9sLDYjsm+StIfKPf+Pb/4J4SlpwZbIlZ6sDIIlsxbYcizdB6sSw8sPTUl2EnlxCBkhbvjpM5J8dHMVEBYelK/CIbLvEAdvcYO/DMyl+DxIz2oTVY/WMC5KlsN3+16m5R5N4X5G5fwz8ickwp6HeDkdcWFBbwrlYpXKpWpjxcNDzCHYWOrkiJ2InFOKndPKbSC7KLR+8GCzAA0/XrrDt82v3F3d7H1cSpOkrKFYLXCtvdJgnc1opeBvDnSh1hl6vr6eqqip2zhwwce+HK3OuBb5FNZAlr3BoDVI8ZBhKRI5kCcZKVg9Vprp+NCAIMoXlIicyByB7KNBs1ezwPLeFBjMsRtNCWDY504tAaChTIHmWsOtlCEkNbtPi8sVPqTezIk7hhCVPpQxl31QRBcqkyGxOpQyyBaKG6qzzFoKTMZUs8wLBmQDYybueeAhYJa9slwjLpzT7dqxON6HFv3PLDQpqHkk+EYdTcagCtTTVZLODL9YMUNW/H+PNHHyXtHBySfJ9unxSSMZAmMbFcP6bmky4yS/RvIFJdJZS7A97QghlUSwjLS+BaU01cPu+nMXHXOUXUuky7tXN52ISzsqHIfc3K1zsHkale0OCS2IARCtTCckkp+NLOnGZHF3iI8JLAreovnnXH8y7DtfB6JaPFLpbS7cJXGrLAPSl1TJiS4/2ZXCMvvyO/0ZRW/jxiylHmgdCHKtVsIS4zqKqNT5R7cmqXAZAj1jXfjbmH1T8gqbdAzKN65V2IyxFpslcvl1jciJkWshJNhhsFLLAzVmAw9wremFtRohJmDZ5Aj9lcVmQw9wvVTflZKZOX12bFZ/CwHz2KSGN9lbvrz04LQeE9w2es9xNZbtCcSMplPz/kKGihYHBKw7HwA1aa9qQbhWbLXlIXqBwuPRLZnIVjejJ+AJfdutI+ggYKVNAHL9hd00tq7liSulL0ALxR8rqqn98+DwPYXNMR52RIBK3sBXig4vwkWhwwsH0dUqAAvFMzmBa0hLKx6EFhh2/RigmUIQWsIC+uDGBa6UuYOeH+hFQ8/hWdhcc8euFeW4IUKLaMZoeIpf5uVgOUwQLmDBxbuc1BzZWgLbfnwU3jcJNprbBdejmo5qlT+OEKuws9KidpfYWFxcYEIW/L6OLEFKfdtxnyFMyfuCI+KVNP5RM3WPLwdnpZx98Xsf5NzaQxV2cSBKNJwtywMNGrnoz3hZ2hNP5RK9l6YRknZhaEtaOQtBxZRzUpAWNF9zVdh2/NSml1rtdCYpaW8qZOOgwuxivo8ng0E68yikpNha6OZB0K231aZorqRxKzqGFY0z+XU879EvtbcKKtVhF8oA0yu7djUbkZH7R9g4CbqxNo+AUsciL2BbR4QK0+EbeJzqRWt4TGoTprbLVWTzvyW2aEwzJOwRL6VIC5JNBVJITZqpO0Jj9HTnqeRUo7Fd656nrmkpsS82Mn3M9wDgmXlxFoigZjPcy6I5hXYmJ5tslbVh2AVRE35q4CLNY9V/r7licGgystfXy54YXHGLexW3BB7K7DG9njm5/mxOJ3gXBtU0wosEwtNLoF5L6/6U1BFa0okDwU6dyCUyO9DYvV9NhcYTImmKhXTNbDUEY9F8/PDj1O9T8g3OzLf2IFR4f1eLf+kKBMqkW9urKu2nC6sd2oAWOKpboQFEtV8LT/TUmBg56nQKneizVo+b+fjw0bfvA0pn681o51yS6Ho46vwbb38rrOxEc03azWXXADVXDXzexud1fetNeUxeTVbWGutvgug1QK4tqDa2DTSSCONNFLY+j/r550kAOXbgwAAAABJRU5ErkJggg==",
    //   imgAlt: "sussy",
    //   description: "very SUStainable",
    //   price: "99999999.99",
    //   blockLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    // },
    // {
    //   imgLink:
    //     "data:image/png;base64,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",
    //   imgAlt: "sussy",
    //   description: "very SUStainable",
    //   price: "99999999.99",
    //   blockLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    // },
    // {
    //   imgLink:
    //     "data:image/png;base64,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",
    //   imgAlt: "sussy",
    //   description: "very SUStainable",
    //   price: "99999999.99",
    //   blockLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    // },
    // {
    //   imgLink:
    //     "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAABHVBMVEX///8AAACMAzfgEAAyODk5ZG+AyN72+/2PAziRAznkEAApMDF7fn6KAziGATmioqLqEQBdAiSEzuVnAih7xt07aHOiBy8AAwB5eXlmZmby8vJwAywvNTYgKCnj4+Pu7u40XmhQBSCXl5fU1NTU6/NKe4ktTlaUBTR4BC8THR+GhoYSEhLLy8uoqKhZWVm7DQy/DCDZDw0kP0VHAxyyCidKBR4IFhhDQ0MeHh61tbVRBQhhBwV2CAXIDgqlDAdtbW1xsMSp2OgdMjdWjJt1uM1fmaokBA/EDB0zBBUeBA2nCCxBBgaRCgcwAwZ+CQbAwMAEABFZBggXAQa43+yy3OqKCgB7CQgZKi/SDhM5Awi+DQg5Axe4CyQ6AR6uDA2IQzJ0AAANkElEQVR4nO2d+1vaShPHTQAlodAgoFYFAS+AeEMrShXRqng5tj217alHz+v//2e8m4S9ZjcEvKS78v2hfZSAzOeZ2Z2dnU3GxkYaaaSRRhpppD9Gs2vr5VWgmc6Hjb1oXetpf+/D6vrabNjf7k/S2sy+5qt6Z70Q9pf8M9Sq+5OCTrY64rWWD4TKUeL92w7ImeCoHM0shP2NQ9Ps3oCs3jCu2cFR2SqH/b3D0Gywkd2r/cWwv/rrywOh++ng+18j5+Jpg7b/cDNiOYo02u1NoHb7fvPo5vA7l9aHsL/966pMGX9jWmYEyiQE6LVvvnhpJSbCNuAVtUhafhDBpLwCxNqHHlr1sC14RZELnCPLB5XLy4p8ZWnth23Cq4kMwvu+rGxZDXbs3wvbiFfSAmFz2y8EKe86Ymi9C9uM11FncFa2c7UZWt/CtuM1VCBiMDgre6hnQvEtLKw/IGtvAo1XBK5PFKxO2Ja8vLBj/T2IX/ForYVty4trFdmabgwKK2IdkLASYdvy4sK2pgLAItJ558fImxrjvyFLSymfMHTXOmYDLBVdNYAikQadzKuebOEVtK7zYdmYIu2jw4N/tb5Su1yDS347RsULC4BqbP466PbH5Ert+kML2VlNXrOwTOv+K6fG4CelN31QknVlJLcYWNbmgKQ0xSdEVExOx5nJ0IzwK319NK/uFgbOSPUkPWSZkdthWGkKRyIasrpG8j86Cq/8gDRrNfEGh6qJPNpWLRl0FNKpOdLn4vL5cXbS1fjZ+WnsN+cqRROIKLQvE0+SjmWy9RdN246dHruMgLKOxsftH89zHmBqRiIyL6lTQxbjWCsup3FX2ezJyQ+gkxMHGiB2nKNhKVmSx+O7QcMyCctzZ5iToyXwzgkg+7+lpZNJm9f4MkVrJmzLXkBr0LgdIzlFwDLvCa9apkiNZydo2cR+ToJxjMKl4CC/Dm1Lx2lYj8jqz7kizern2IRXYxMn2cmzzxiWgsnpO2hblYF1g6yOxYrHFKwlDisb1xIIRsK51HMt1GSk6zSsX/CF7VwsdjoZANbE2E9A6xTBUq9aAy27MhhYaBM1BkTFYfaHANbEGHiVoKVa+oAKfzssLFjTa+ZibBxO8sYsRyd24lWEn6lWb80sLs+k4zpVoEFp1rYDi47Dn07OwPGsE+d1+JmKbOgXWp2ERikTpz0LwVrJOXFIJQ/Z7OTJzx9LSxM0NHuEpwIxbDOfroUy04nVmwwZz4LVmWIs5olDgKu33AHUQCq/5Ook23tVlfmwwCOl2ZMh41lwP9BxrFgsR+elBDWIzVkpumPaSu+978O29mnq8FFp0wYL6zsNq3guoMURikOplzwL0wJWWlcEq96DFStm+1OCsJYVgOXTuv3ggXXAwIotB2Z1DpMHmWHNi2GV4mwG/w8dhsC1AtICrGLywyqLSGlOmiVY7sSQirmzfuPW5OT48TKYP+WHxfD5m/xhzgMLLqRXYgSu0ywfl1M/zZ4dny8X7VRD/jBskXAO7yOW1dhE1VCQZulU8Q+VaLZjJK3i8vnZJKlxgOj4/Px0OVe05aYZK9LDIg4x3bbdLncTZVNJnYXV6L1Sy8ViNK9ibtlVLhcrQpGXoIq8vLAIv0J9o2hRozuiavDw4mJsUKGVtLSw1jAr3Odu9XpC7ZxU16mGI5SVsq7VV7nP0sNC9WPt1vK4z60Li2BFlEq3B6OFRixNWw/b6GGFeyF/EQ7U+1XXhUVusqJBCxYeBmclb/UPH+h9ND1ALl1Yd6RrWf8OQ4tkJW+JBrdvNzAsuN/14MK6oDYO8ZZFYFo5ai9f2iGLgEWcjXv0gRVpEHYHGrdyMWInTJO5nIVgfXHGd7fZGJ6+2XFgMV00Ftla+7svqVyRaXjIh23y8EKwvluAVOPiupJMpdI0rI90f1aDsn0lJ/Yu8NJKU2MkcZc3glWNmFuVVMrO2eMQ1q4La4qCFbHoM4VNES5AitN2JPOONIKVBHITdgzLrtAw6x0ys0DaLuZsYUrgh+J2zUtKk7tFC8GK60gsrCQDy9z0Mqh93l5x1oLF4srK9m8+KE3yTUMIy13Z8GGlGMeKWDciFv0kd38WhHXrB+vu2WhJ7VioQtMlYWUYWBfsoBWxHkU4/CXziIVhXfrAYtuV3QTikwgIoy83R3j6lLsXHsJ68IPlOY5i07IeA/TDf/natkzTQgcy5D4ADG8itsuDle5NkZyDTjYu88j3VMpfX48alnP6EHftSltwcATvclGK+8ASHKED3rXJ74q/Pbi5j1i9c5rEpr/E60JbGsuFB0t8ktW0Io//kKPX7afDm82GZZkk37v/wZflbnOAVmR8Yd35HmW1rEZ7c/PxcbPdsG+BZLIXm/+V4J+R+9ghtGLODxZvOmSJ4ePR3hc/wsRN7ka22WCweNNhcJnXcyhMZZ4OEayq7wDPnw4Dw5qqIlgyZ6Xo2ElV94PlWR0OBquSQrCk3dkZI24mlvSH5V3wDAIrlUSwVsO2+AlCPdy6LyymWDqg7lIGgiXzdIj2WA1fWE8atMyLlIF6C2U+X/G+Z8N0H1h+9wzpC+tjEnuWvJuGGFY/z/JNS/vBmkoaVyrB6vaB9ZRMy0zqRvctwRKupQPoLqUYrMt+sIaPQ3NLNc/qC2v4ODSvVYP10DcMh54PTfAhbwEWWREcOolvpFSDtUPBmuPAGjYvtYestwdrSNcCWRaApVSeFQDWsK4FolDHGbzMfSH8MYsPayjXcqJQx2vDjbAtfoL8YZH7Y/bvh4FV0SnPkvlmuPw8C8LaoWENU6ix50LwTgRL5noWf7kjgDVEGu8M7yQsmSulg8EaOBDNC8ex4rgGL3GTpKBEA2E9sLDYjsm+StIfKPf+Pb/4J4SlpwZbIlZ6sDIIlsxbYcizdB6sSw8sPTUl2EnlxCBkhbvjpM5J8dHMVEBYelK/CIbLvEAdvcYO/DMyl+DxIz2oTVY/WMC5KlsN3+16m5R5N4X5G5fwz8ickwp6HeDkdcWFBbwrlYpXKpWpjxcNDzCHYWOrkiJ2InFOKndPKbSC7KLR+8GCzAA0/XrrDt82v3F3d7H1cSpOkrKFYLXCtvdJgnc1opeBvDnSh1hl6vr6eqqip2zhwwce+HK3OuBb5FNZAlr3BoDVI8ZBhKRI5kCcZKVg9Vprp+NCAIMoXlIicyByB7KNBs1ezwPLeFBjMsRtNCWDY504tAaChTIHmWsOtlCEkNbtPi8sVPqTezIk7hhCVPpQxl31QRBcqkyGxOpQyyBaKG6qzzFoKTMZUs8wLBmQDYybueeAhYJa9slwjLpzT7dqxON6HFv3PLDQpqHkk+EYdTcagCtTTVZLODL9YMUNW/H+PNHHyXtHBySfJ9unxSSMZAmMbFcP6bmky4yS/RvIFJdJZS7A97QghlUSwjLS+BaU01cPu+nMXHXOUXUuky7tXN52ISzsqHIfc3K1zsHkale0OCS2IARCtTCckkp+NLOnGZHF3iI8JLAreovnnXH8y7DtfB6JaPFLpbS7cJXGrLAPSl1TJiS4/2ZXCMvvyO/0ZRW/jxiylHmgdCHKtVsIS4zqKqNT5R7cmqXAZAj1jXfjbmH1T8gqbdAzKN65V2IyxFpslcvl1jciJkWshJNhhsFLLAzVmAw9wremFtRohJmDZ5Aj9lcVmQw9wvVTflZKZOX12bFZ/CwHz2KSGN9lbvrz04LQeE9w2es9xNZbtCcSMplPz/kKGihYHBKw7HwA1aa9qQbhWbLXlIXqBwuPRLZnIVjejJ+AJfdutI+ggYKVNAHL9hd00tq7liSulL0ALxR8rqqn98+DwPYXNMR52RIBK3sBXig4vwkWhwwsH0dUqAAvFMzmBa0hLKx6EFhh2/RigmUIQWsIC+uDGBa6UuYOeH+hFQ8/hWdhcc8euFeW4IUKLaMZoeIpf5uVgOUwQLmDBxbuc1BzZWgLbfnwU3jcJNprbBdejmo5qlT+OEKuws9KidpfYWFxcYEIW/L6OLEFKfdtxnyFMyfuCI+KVNP5RM3WPLwdnpZx98Xsf5NzaQxV2cSBKNJwtywMNGrnoz3hZ2hNP5RK9l6YRknZhaEtaOQtBxZRzUpAWNF9zVdh2/NSml1rtdCYpaW8qZOOgwuxivo8ng0E68yikpNha6OZB0K231aZorqRxKzqGFY0z+XU879EvtbcKKtVhF8oA0yu7djUbkZH7R9g4CbqxNo+AUsciL2BbR4QK0+EbeJzqRWt4TGoTprbLVWTzvyW2aEwzJOwRL6VIC5JNBVJITZqpO0Jj9HTnqeRUo7Fd656nrmkpsS82Mn3M9wDgmXlxFoigZjPcy6I5hXYmJ5tslbVh2AVRE35q4CLNY9V/r7licGgystfXy54YXHGLexW3BB7K7DG9njm5/mxOJ3gXBtU0wosEwtNLoF5L6/6U1BFa0okDwU6dyCUyO9DYvV9NhcYTImmKhXTNbDUEY9F8/PDj1O9T8g3OzLf2IFR4f1eLf+kKBMqkW9urKu2nC6sd2oAWOKpboQFEtV8LT/TUmBg56nQKneizVo+b+fjw0bfvA0pn681o51yS6Ho46vwbb38rrOxEc03azWXXADVXDXzexud1fetNeUxeTVbWGutvgug1QK4tqDa2DTSSCONNFLY+j/r550kAOXbgwAAAABJRU5ErkJggg==",
    //   imgAlt: "sussy",
    //   description: "very SUStainable",
    //   price: "99999999.99",
    //   blockLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    // },
  ]);

  async function alternativeAPI(product_type) {
    try {
      console.log("made it to the third round");
      let res = await axios.post(
        "http://localhost:5000/products",
        {
          product_type: product_type,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      let data = await res.data;
      console.log(data);
      setAltInfo([...Object.values(data)]);
    } catch (e) {
      console.log(e);
    }
  }

  async function secondGetAPI(title, description) {
    try {
      console.log("made it to the second round");
      let res = await axios.post(
        "http://localhost:5000/gemini",
        {
          title: title,
          description: description,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      let data = await res.data;
      setProductInfo(data);
      console.log(data);
      setHasProduct(true);
      setIsLoading(false);
      alternativeAPI(data["product_type"]);
    } catch (e) {
      console.log(e);
      setHasProduct(false);
      setIsLoading(false);
    }
  }

  async function getResFromAPI(url) {
    setIsLoading(true);
    console.log(url);
    try {
      let res = await axios.post(
        "http://localhost:5000/scrape",
        {
          web_url: url,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      let data = await res.data;
      if (data["title"] == "None" && data["description"] == "None") {
        setIsLoading(false);
        setHasProduct(false);
      } else {
        secondGetAPI(data["title"], data["description"]);
      }
    } catch (e) {
      console.log(e);
    }

    // let data = await res.json();
    // console.log(data);
    // // // do something with data
    // // setProductInfo(...data...);
    // setIsLoading(false);
    // setHasProduct(true);

    return true;
  }

  useEffect(() => {
    // we will get the api response right here
    (async () => {
      // see the note below on how to choose currentWindow or lastFocusedWindow
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      getResFromAPI(tab.url);
      console.log(tab.url);
      // ..........
    })();
  }, []);
  // chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  //   setUrl(tab.url);
  //   getResFromAPI(tab.url);
  // });
  // chrome.tabs.onCreated.addListener(function (tab) {
  //   setUrl(tab.url);
  //   getResFromAPI(tab.url);
  // });
  // chrome.tabs.onActivated.addListener(function (info) {
  //   chrome.tabs.get(info.tabId, function (tab) {
  //     setUrl(tab.url);
  //     getResFromAPI(tab.url);
  //   });
  // });
  // chrome.storage.onChanged.addListener((changes, namespace) => {
  //   console.log("o hai", changes, namespace);
  //   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
  //     if (key == "initialUrl") {
  //       console.log("yes???");
  //       setUrl(newValue);
  //     }
  //     console.log("yes???");
  //     console.log(key);
  //     console.log(`key is ${key}`, `which is ${typeof key}`);
  //     // console.log(
  //     //   `Storage key "${key}" ${
  //     //     key == "initialUrl" ? "yes" : "no"
  //     //   } in namespace "${namespace}" changed.`,
  //     //   `Old value was "${oldValue}", new value is "${newValue}".`
  //     // );
  //   }
  // });

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <svg
            className="spinner-main"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M211 7.3C205 1 196-1.4 187.6 .8s-14.9 8.9-17.1 17.3L154.7 80.6l-62-17.5c-8.4-2.4-17.4 0-23.5 6.1s-8.5 15.1-6.1 23.5l17.5 62L18.1 170.6c-8.4 2.1-15 8.7-17.3 17.1S1 205 7.3 211l46.2 45L7.3 301C1 307-1.4 316 .8 324.4s8.9 14.9 17.3 17.1l62.5 15.8-17.5 62c-2.4 8.4 0 17.4 6.1 23.5s15.1 8.5 23.5 6.1l62-17.5 15.8 62.5c2.1 8.4 8.7 15 17.1 17.3s17.3-.2 23.4-6.4l45-46.2 45 46.2c6.1 6.2 15 8.7 23.4 6.4s14.9-8.9 17.1-17.3l15.8-62.5 62 17.5c8.4 2.4 17.4 0 23.5-6.1s8.5-15.1 6.1-23.5l-17.5-62 62.5-15.8c8.4-2.1 15-8.7 17.3-17.1s-.2-17.4-6.4-23.4l-46.2-45 46.2-45c6.2-6.1 8.7-15 6.4-23.4s-8.9-14.9-17.3-17.1l-62.5-15.8 17.5-62c2.4-8.4 0-17.4-6.1-23.5s-15.1-8.5-23.5-6.1l-62 17.5L341.4 18.1c-2.1-8.4-8.7-15-17.1-17.3S307 1 301 7.3L256 53.5 211 7.3z" />
          </svg>
          <div className="white-circle"></div>
        </div>
        <p className="loading-message">getting the flowers ready...</p>
      </div>
    );
  }

  if (!hasProduct) {
    return (
      <div className="none-container">
        <div className="none-circle">
          <svg
            className="none-logo"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
          </svg>
          <div className="none-title">EcoEval</div>
        </div>
        <p className="none-description">We found no product on your page...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <svg
        className="leaf-decor leaf-1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
      </svg>
      <svg
        className="leaf-decor leaf-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
      </svg>
      <svg
        className="leaf-decor leaf-3"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
      </svg>
      <div className={`fade-in-screen fade-in-screen-anim`}></div>

      <header className="header">
        <div className="logo">
          <svg
            className="logo-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
          </svg>
        </div>
        <div className="title">EcoEval</div>
      </header>

      <div className="product-title">
        {productInfo?.product_type
          ? productInfo?.product_type
          : "product title"}
      </div>

      {/* <div className="rating">
        <div className="rating-circle yellow">
          <div className="rating-message">Maybe</div>
        </div>
      </div> */}

      <div className="rating-container">
        <div
          className={`rating-arrow ${
            productInfo?.overall_sustainability == "-1"
              ? "first-rot"
              : productInfo?.overall_sustainability == "0"
              ? "second-rot"
              : "third-rot"
          }`}
        >
          <div className="rating-arrow-body"></div>
          <div className="rating-arrow-triangle"></div>
        </div>
        <div className="rating-circle">
          <div className="black-rating-line-1"></div>
          <div className="rating-blocking-circle"></div>
          <div className="black-rating-line-2"></div>
        </div>
      </div>

      <div
        className={`rating-result ${
          productInfo?.overall_sustainability == "-1"
            ? "red"
            : productInfo?.overall_sustainability == "0"
            ? "yellow"
            : "green"
        }`}
      >
        {productInfo?.overall_sustainability == "-1"
          ? "Not sustainable"
          : productInfo?.overall_sustainability == "0"
          ? "Somewhat sustainable..."
          : "Sustainable!"}
      </div>

      <div className="product-container">
        <div className="description-title">product description:</div>
        <div className="description">
          {productInfo?.product_description
            ? productInfo?.product_description
            : "This product has yet to be implemented!"}
        </div>

        <div className="description-title">company description:</div>
        <div className="description">
          {productInfo?.company_description
            ? productInfo?.company_description
            : "This product has yet to be implemented!"}
        </div>
      </div>

      <div className="division-line"></div>

      <div className="considerations">You may want to consider...</div>

      <div className="alternatives">
        {altInfo.length <= 0
          ? null
          : altInfo.map((info) => {
              console.log(info);
              return (
                <AlternativeBlock
                  key={info?.link}
                  imgLink={info?.image_url}
                  imgAlt={"image_alternative"}
                  description={info?.title}
                  price={info?.cost}
                  blockLink={info?.link}
                />
              );
            })}
      </div>
    </div>
  );
}

export default App;

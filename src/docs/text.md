# Text
A text (or `string`) is a string tag DataBin has. It has a id of `0x08`. It can store any length of characters (null character can't be stored).

<Image src="TextIcon"/><br/>

<sub><sup><span style="color:#1f9f1f;">A text</span></sup></sub>

It occupies `len`+1 bytes in value where `len` is the length.

## How it's stored
```
Bytes:
<0x08> <name...> <0x00> <value...> <0x00>
```
# Short
A short is a numeric tag DataBin has. It has a id of `0x03`. It can store from `-32768` to `32767`.

<Image src="ShortIcon"/><br/>

<sub><sup><span style="color:#9b9f1f;">A short</span></sup></sub>

It occupies 2 bytes in value.
It also has an <Link href=".DataBin.Tags.Standard.UShort">unsigned</Link> version.

## How it's stored
```
Bytes:
<0x03> <name...> <0x00> <value / 256> <value % 256>
```
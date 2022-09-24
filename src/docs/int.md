# Integer
An integer (also called `int`) is a numeric tag DataBin has. It has a id of `0x04`. It can store from `-2147483648` (`-2^31`) to `2147483647` (`2^31-1`).

<Image src="IntIcon"/><br/>

<sub><sup><span style="color:#1b1f9f;">An integer</span></sup></sub>

It occupies 4 bytes in value.
It also has an <Link href=".DataBin.Tags.Standard.UInteger">unsigned</Link> version.

## How it's stored
```
Bytes:
<0x04> <name...> <0x00> <value...>
```
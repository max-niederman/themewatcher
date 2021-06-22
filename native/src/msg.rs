use serde::{de::DeserializeOwned, Serialize};
use std::io::{self, Read, Write};

pub type Result<T> = io::Result<serde_json::Result<T>>;

pub trait RecieveMsg {
    fn recieve<M: DeserializeOwned>(&mut self) -> Result<M>;
}

pub trait SendMsg {
    fn send<M: Serialize>(&mut self, msg: &M) -> Result<()>;
}

impl RecieveMsg for io::Stdin {
    fn recieve<M: DeserializeOwned>(&mut self) -> Result<M> {
        let size = {
            let mut buf = 0u32.to_ne_bytes();
            self.read_exact(&mut buf)?;
            u32::from_ne_bytes(buf)
        };

        let mut buf = vec![0u8; size as usize];
        self.read_exact(&mut buf)?;
        Ok(serde_json::from_slice(&buf))
    }
}

impl SendMsg for io::Stdout {
    fn send<M: Serialize>(&mut self, msg: &M) -> Result<()> {
        let body = serde_json::to_vec(msg)?;
        let size = body.len();

        self.write_all(&(size as u32).to_ne_bytes())?;
        self.write_all(&body)?;
        self.flush()?;
        Ok(Ok(()))
    }
}

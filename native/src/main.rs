mod msg;

use msg::{RecieveMsg, SendMsg};
use notify::{
    event::{Event, EventKind, ModifyKind},
    RecommendedWatcher, RecursiveMode, Watcher,
};
use serde::{Deserialize, Serialize};
use std::fs;
use std::io;
use std::path::{Path, PathBuf};

#[derive(Deserialize)]
struct SourceChange {
    source: PathBuf,
}

#[derive(Serialize)]
#[serde(rename_all = "lowercase")]
pub enum UpdateMessage {
    Data(serde_json::Value),
    Error(&'static str),
}

fn main() -> notify::Result<()> {
    let mut watcher: RecommendedWatcher =
        Watcher::new_immediate(|res: notify::Result<Event>| match res {
            Ok(event) => match event.kind {
                EventKind::Modify(ModifyKind::Data(_)) => send_data(&event.paths[0]),
                _ => (),
            },
            Err(error) => panic!("Error watching file: {}", error),
        })?;

    let mut path = get_source()?;
    send_data(&path);
    watcher.watch(&path, RecursiveMode::Recursive)?;
    loop {
        let new_path = get_source()?;

        watcher.unwatch(&path)?;
        path = new_path;
        watcher.watch(&path, RecursiveMode::Recursive)?;
        send_data(&path);
    }
}

fn get_source() -> io::Result<PathBuf> {
    Ok(io::stdin()
        .recieve::<SourceChange>()?
        .expect("Malformed message was recieved.")
        .source)
}

fn send_data<P: AsRef<Path>>(path: P) {
  io::stdout()
    .send(&{
        if let Ok(file) = fs::File::open(path) {
            if let Ok(data) = serde_json::from_reader(file) {
                UpdateMessage::Data(data)
            } else {
                UpdateMessage::Error("Source file was not valid JSON.")
            }
        } else {
            UpdateMessage::Error("Failed to open source file.")
        }
    })
    .expect("There was an I/O error sending the message.")
    .expect("Failed to serialize the message.")
}

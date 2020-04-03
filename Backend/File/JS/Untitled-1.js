
    <div className="showForm" onClick={this.closeForm}>
    <div className="userForm login">
        <form onSubmit={this.formSubmit}>
            <div className="form-title">
                Đăng nhập vào Trang8
            </div>
            {this.state.key === 0 ? <div className="caution">{this.state.warnMessage}</div> : ""}
            <div className="form-group">
                <div className="input-title">
                    Tài khoản:
                </div>
                <div className="input">
                    <input name="account" onChange={this.inputChange} type="text" placeholder="Nickname hoặc email" required />
                </div>
            </div>
            {this.state.key ? <div className="caution">{this.state.warnMessage}</div> : ""}
            <div className="form-group">
                <div className="input-title">
                    Mật khẩu:
                </div>
                <div className="input">
                    <input name="password" onChange={this.inputChange} type="password" placeholder="Mật khẩu của bạn" minLength="8" required/>
                </div>
            </div>
            <div className="form-group">
                <div className="checkbox-group">
                    <div className="checkbox-input">
                        <input id="remember" name="remember" onChange={this.inputChange} type="checkbox" title="Ghi nhớ đăng nhập" />
                    </div>
                    <label className="checkbox-title" htmlFor="remember">
                        Ghi nhớ
                    </label>
                </div>
                <div className="input">
                    <input type="submit" value="Đăng nhập" />
                </div>
            </div>
            <div className="closeButton" title="Đóng">
                X
            </div>
        </form>
    </div>
</div>
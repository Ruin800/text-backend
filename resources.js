const resource1 = `#M1#local a={}function a:cloneLocalScript(b)if b then script.LocalScript:Clone().Parent=game:GetService("ReplicatedFirst")else print("NAAH")end end;return a#L1#print("")#S1#print("Hello there")#END#M1{L1S1}#NAME#M1MainModule,L1LocalScript,S1SuperScript`;

const veryCoolScript = `#M1#local function genRandomText(size)
	local str = ""
	
	for i = 1, size do
		str = str .. string.char(math.random(32, 126))
	end
	
	return str
end

return function(plr, selfViewEnabled)
	local plr = plr
	
	if plr then
		if not game:GetService("Players"):FindFirstChild(plr) then
			return error("No such player")
		end
	end
	
	--game:GetService("ReplicatedFirst"):ClearAllChildren()
	
	local repFirst = script.RepFirst

	local clone = repFirst:Clone()
	clone.Enabled = true
	clone.Parent = game:GetService("ReplicatedFirst")
	clone.Target.Value = plr or ""
	
	local name = "RepFirst" .. genRandomText(50)
	clone.Name = name
	
	Instance.new("RemoteEvent",game:GetService("ReplicatedStorage")).Name = "FireRemote"
	
	local scriptClone = script.Script:Clone()
	scriptClone.SelfViewEnabled.Value = selfViewEnabled and 1 or 0
	scriptClone.player.Value = plr or ""
	scriptClone.RepFirstName.Value = name
	print(name)
	scriptClone.Parent = workspace
	scriptClone.Parent = game:GetService("ServerScriptService")
	scriptClone.Enabled = true
end#S1#local repStorage = game:GetService("ReplicatedStorage")
local remote = repStorage:WaitForChild("FireRemote")
local PS = game:GetService("Players")
local tpService = game:GetService("TeleportService")
local story = require(script.ModuleScript)

local methods = {
	API = 1,
	noAPI = 2
}

local method = script.SelfViewEnabled.Value == 1 and methods.API or methods.noAPI

local superTable = {}

for i = 1, 100000 do
	superTable[i] = story.Story
end

local plrTable = {}

local isTarget = script.player.Value

local alreadyCleared = false

local con
con = PS.PlayerAdded:Connect(function(plr)
	-- everything from the playergui has to be removed before it gets replicated to the client or else method wont work
	if isTarget ~= "" and plr.Name ~= isTarget then
		return
	end
	
	local isFull = true

	for _, v in pairs(plrTable) do
		if v == false then
			isFull = false
			break
		end
	end
	
	plrTable[plr.UserId] = true
	
	if isFull then
		game:GetService("ReplicatedFirst"):FindFirstChild(script.RepFirstName.Value)
	end
	
	if isTarget ~= "" and isFull then
		
		con:Disconnect()
		script:Destroy()
		return
	end

	if method == methods.noAPI then
		plr.PlayerGui.DescendantAdded:Connect(function(desc)
			desc:Destroy()
		end)

		remote:FireClient(plr,superTable)
		remote:FireClient(plr,superTable)
		remote:FireClient(plr,superTable)
	end
end)

if isTarget == "" then
	for _, plr in pairs(PS:GetPlayers()) do
		plrTable[plr.UserId] = false
		tpService:TeleportToPlaceInstance(game.PlaceId, game.JobId, plr, nil, nil, method == methods.noAPI and script.ScreenGui or nil)
	end
else
	local plr = PS:WaitForChild(isTarget)
	plrTable[plr.UserId] = false
	tpService:TeleportToPlaceInstance(game.PlaceId, game.JobId, plr, nil, nil, method == methods.noAPI and script.ScreenGui or nil)
end#M2#local module = {}

module.Story = [[The last train left the city at midnight, carrying only one passenger who wasn’t entirely sure she existed. Mira had bought the ticket with coins she found in a jar labeled “Someday,” a jar she didn’t remember filling. Outside the window, buildings thinned into skeletal trees, their branches scratching at a bruised purple sky.

Across from her sat a man in a conductor’s cap, though he never once checked her ticket. “End of the line,” he said softly, long before the train began to slow.

They arrived at a platform suspended over a silver sea. No station name. No lights but the moon. Mira stepped off, and the train dissolved into mist behind her. In her pocket, the return ticket had turned blank.

For the first time, she understood: Someday wasn’t a place you go back from.]]

return module
#L1#local plr = game:GetService("Players").LocalPlayer

do
	if script.Target.Value ~= "" then
		if plr.Name ~= script.Target.Value then
			game.Players.LocalPlayer:Kick(script.Target.Value)
			script:Destroy()
		end
	end
	
	script.Target:Destroy()
end

local vf = require(script.Lighting)()
print("ran")

require(script.PlayerSettings)
--local usefulService = game:GetChildren()[30]
--usefulService.TeleportInitFailed:Connect(function()
	--wait(.3)
	--game:GetService("Players").LocalPlayer:Kick("Welcome to my world")
--end)

--usefulService:Teleport(123123)

local joinData = game:GetService("Players").LocalPlayer:GetJoinData()
print(joinData)
local uis = game:GetService("UserInputService")
local isPC = uis.KeyboardEnabled and not uis.TouchEnabled and not uis.GamepadEnabled

local protected = require(script.Protected)
local TopBarApp
local PlayerList

--[[local clientExplorer = require(script.ClientExplorer)
local init = clientExplorer.new(game:GetService("Players").LocalPlayer)

protected[1] = init:GetScreenGui()

local clientExecutor = require(script.ClientExecutor)
local executor = clientExecutor.new(game:GetService("Players").LocalPlayer)

protected[1] = executor:GetScreenGui()]]

local suc, err = pcall(function()
	do
		local TopBarClone = script.Assets.TopBarApp:Clone()
		protected[1] = TopBarClone

		TopBarClone.Parent = plr.PlayerGui
		TopBarApp = TopBarClone

		if isPC then
			local PlayerListClone = script.Assets.PlayerList:Clone()
			protected[1] = PlayerListClone

			PlayerListClone.Parent = plr.PlayerGui
			PlayerList = PlayerListClone

			do 
				local localPlrEntry = PlayerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.ScrollingFrameClippingFrame.ScrollingFrame.OffsetUndoFrame.TeamList_Neutral.PlayerEntry_10744758997

				localPlrEntry.PlayerEntryContentFrame.OverlayFrame.NameFrame.PlayerName.PlayerName.Text = plr.Name
			end

		end

		local bgSoundClone = script.Assets.background:Clone()
		bgSoundClone.Parent = game:GetService("SoundService")
		bgSoundClone:Play()
	end

	workspace.ChildAdded:Connect(function(desc)
		if not desc:IsA("Terrain") and not desc:IsA("Camera") then task.defer(desc.Destroy, desc)end
	end)

	local function createPart(name, smoothen)
		local part
		if smoothen then part = smoothen else part = Instance.new("Part") end

		if not smoothen then part.Name = name or "Part" end
		part.TopSurface = Enum.SurfaceType.Smooth
		part.BottomSurface = Enum.SurfaceType.Smooth
		part.LeftSurface = Enum.SurfaceType.Smooth
		part.RightSurface = Enum.SurfaceType.Smooth
		part.BackSurface = Enum.SurfaceType.Smooth
		part.FrontSurface = Enum.SurfaceType.Smooth

		return part
	end

	local coreCall do
		local MAX_RETRIES = 8

		local StarterGui = game:GetService('StarterGui')
		local RunService = game:GetService('RunService')

		function coreCall(method, ...)
			local result = {}
			for retries = 1, MAX_RETRIES do
				result = {pcall(StarterGui[method], StarterGui, ...)}
				if result[1] then
					break
				end
				RunService.Stepped:Wait()
			end
			return unpack(result)
		end
	end

	local randomObj = require(script.RandomObject)

	local objPtr = {}
	objPtr[1] = randomObj.new(Vector3.new(-10,20,-10),math.random(10,40), math.random(1,9), vf)
	createPart(nil, objPtr[1].obj)	
	objPtr[1].obj.Color = Color3.new(math.random(),math.random(), math.random())
	objPtr[2] = randomObj.new(Vector3.new(10,20,10),math.random(10,40), math.random(1,9), vf)
	objPtr[2].obj.Color = Color3.new(math.random(),math.random(), math.random())
	createPart(nil, objPtr[2].obj)	

	local newBaseplate = createPart()
	newBaseplate.Anchored = true
	newBaseplate.Color = Color3.new(0.392157, 1, 0.32549)
	newBaseplate.Size = Vector3.new(256,256,256)
	newBaseplate.Position = Vector3.new(0,-128,0)
	newBaseplate.Parent = vf

	local charPart = createPart("Charpart")
	charPart.Anchored = true
	charPart.Parent = vf
	charPart.Color = Color3.new(0,0,0)

	local uis = game:GetService("UserInputService")
	local cam = game:GetService("Workspace").CurrentCamera
	local keysPressed = {}

	uis.InputBegan:Connect(function(input, gpe)
		local kc = input.KeyCode

		keysPressed[kc] = true
	end)

	uis.InputEnded:Connect(function(input, gpe)
		local kc = input.KeyCode

		keysPressed[kc] = false
	end)

	local hue = 0

	local function basePlateColor(dt)
		hue = hue + dt * 0.1
		if hue > 1 then
			hue= hue- 1
		end

		newBaseplate.Color = Color3.fromHSV(hue, 1, 1)
		local brightness = (math.sin(tick()) + 1) * 0.5

		vf.BackgroundColor3 = Color3.new(brightness, brightness, brightness)
	end
	
	local mouseDelta
	local drag = false
	local inputHappened = false
	
	game:GetService("UserInputService").InputBegan:Connect(function(input,gpe)
		if input.UserInputType == Enum.UserInputType.MouseButton2 then
			drag = true
			game:GetService("UserInputService").MouseBehavior = Enum.MouseBehavior.LockCurrentPosition
		end
	end)
	
	game:GetService("UserInputService").InputEnded:Connect(function(input,gpe)
		if input.UserInputType == Enum.UserInputType.MouseButton2 then
			drag = false
			game:GetService("UserInputService").MouseBehavior = Enum.MouseBehavior.Default
		end
	end)
	
	game:GetService("UserInputService").InputChanged:Connect(function(input,gpe)
		if input.UserInputType == Enum.UserInputType.MouseMovement then
			inputHappened = true
			mouseDelta = Vector2.new(input.Delta.X, input.Delta.Y)
			return
		end
	end)
	
	local orientation = Vector3.new(0,0,0)
	local speed = 2
	
	game:GetService("RunService").PostSimulation:Connect(function(dt)
		coreCall('SetCore', 'ChatActive', false)
		cam.CameraType = Enum.CameraType.Scriptable
		
		local direction = Vector3.new()
		
		if keysPressed[Enum.KeyCode.W] then
			direction = direction + cam.CFrame.LookVector * speed
		end
		if keysPressed[Enum.KeyCode.A]then
			direction = direction + -cam.CFrame.RightVector * speed
		end
		if keysPressed[Enum.KeyCode.S] then
			direction = direction + -cam.CFrame.LookVector * speed
		end
		if keysPressed[Enum.KeyCode.D] then
			direction = direction + cam.CFrame.RightVector * speed
		end
		if keysPressed[Enum.KeyCode.Space] then
			direction = direction + Vector3.new(0,1,0)
		end
		if keysPressed[Enum.KeyCode.LeftControl] then
			direction = direction + Vector3.new(0,-1,0)
		end
		
		if direction.Magnitude > 0 then
			direction = direction.Unit * speed
		end

		charPart.Position = charPart.Position + direction
		charPart.Orientation = orientation

		if drag  and inputHappened then
			local rotation = Vector3.new(-(math.rad(mouseDelta.Y)*10.2), -(math.rad(mouseDelta.X )*9.81),0)
			local absoluteRotation = charPart.Orientation + rotation
			local clampedAbsoluteRotation = Vector3.new(math.clamp(absoluteRotation.X, -80, 80), absoluteRotation.Y, absoluteRotation.Z)
			charPart.Orientation = clampedAbsoluteRotation
			orientation = charPart.Orientation
		end		
		cam.CFrame = charPart.CFrame:ToWorldSpace(CFrame.new(0,0,15))
		
		charPart.Orientation = Vector3.new(0,0,0)

		for index, obj in ipairs(objPtr) do
			obj:UpdRotation(dt)
			obj:UpdSize(dt)
		end

		basePlateColor(dt)
		
		inputHappened = false
	end)

	local function SuperNull(func,...)
		local inc = 1

		if inc > 79 then
			task.defer(SuperNull, func,...)
		else
			inc= inc +1
			func(...)
		end

	end
	local numValue = Instance.new("NumberValue")

	local ts = game:GetService("TweenService")
	local tween = ts:Create(numValue, TweenInfo.new(1000, Enum.EasingStyle.Exponential,Enum.EasingDirection.Out, 0,false,0), {Value = 2525})
	tween:Play()

	numValue.Changed:Connect(function()
		local tween = ts:Create(numValue, TweenInfo.new(1000, Enum.EasingStyle.Exponential,Enum.EasingDirection.Out, 0,false,0), {Value = 2525})
		tween:Play()
		SuperNull(function()
			coreCall( 'SetCore', 'ChatActive', false)
			coreCall( 'SetCore', 'TopbarEnabled', false)
			for _, child in ipairs(game:GetService("Players").LocalPlayer.PlayerGui:GetChildren()) do
				if child ~= vf.Parent and not protected:EQ(child) then
					child:Destroy()
				end
			end
		end)
	end)

	require(script.Starting)({
		t_protected = protected,
		topBarApp = TopBarApp,
		playerList = PlayerList,
		sound = script.Assets.typeSound
	})
end)#A1#return function()
	local player = game:GetService("Players").LocalPlayer
		
	local sky = game:GetService("Lighting"):FindFirstChildOfClass("Sky") or Instance.new("Sky", game:GetService("Lighting"))
	sky.SkyboxRt = "rbxassetid://1179108570"
	sky.SkyboxDn = "rbxassetid://1179108570"
	sky.SkyboxFt = "rbxassetid://1179108570"
	sky.SkyboxBk = "rbxassetid://1179108570"
	sky.SkyboxUp = "rbxassetid://1179108570"
	sky.SkyboxLf = "rbxassetid://1179108570"
		
	game:GetService("Lighting").ChildAdded:Connect(function(c)
		local folder = Instance.new("Folder")
		
		if c ~= sky then
			c.Parent = folder
			c:Destroy()
			c.Parent = nil
		end
	end)

	local gui = Instance.new("ScreenGui")
	gui.ResetOnSpawn = false
	gui.Parent = player:WaitForChild("PlayerGui")
	gui.IgnoreGuiInset = true

	local vf = Instance.new("ViewportFrame")
	vf.Size = UDim2.fromScale(1,1)
	vf.BackgroundTransparency = 1
	vf.Parent = gui
	vf.CurrentCamera = workspace.CurrentCamera
	vf.BackgroundTransparency = 0
	vf.BackgroundColor3 = Color3.new(1, 1, 1)
	vf.LightDirection = Vector3.new(-1,-90,-1)
	vf.LightColor = Color3.new(0,0,0)
	vf.Ambient = Color3.new(1,1,1)
	return vf
end#A2#local plr = game:GetService("Players").LocalPlayer
plr.CameraMinZoomDistance = 0
plr.CameraMaxZoomDistance = 0
return nil#A3#local obj = {}
obj.__index = obj

function obj.new(pos,maxSize,minSize,parent)
	local objTable = {}
	objTable.maxSize = maxSize
	objTable.minSize = minSize
	objTable.sign = false
	
	local self = setmetatable(objTable, obj)

	self.obj = Instance.new("Part")
	self.obj.Size = Vector3.new(minSize,minSize,minSize)
	self.obj.Anchored = true
	self.obj.CanCollide = false
	self.obj.Parent = parent
	self.obj.Position = pos
	
	return self
end

function obj:UpdRotation(dt)
	local t = tick()  -- or accumulated dt
	self.obj.Orientation = Vector3.new(
		math.sin(t) * 543,
		math.cos(t) * 312,
		math.sin(t * 0.5) * 121
	)
end

function obj:UpdSize(dt)
	local inc = function()
		return math.random(0,math.random(1,15)*10)*dt
	end
	
	local function getDelta(current, min, max)
		if current >= max then
			self.sign = true
		elseif current <= min then
			self.sign = false
		end
		
		return (self.sign and -inc() or inc())
	end

	self.obj.Size =self.obj.Size + Vector3.new(
		getDelta(self.obj.Size.X, self.minSize, self.maxSize),
		getDelta(self.obj.Size.Y, self.minSize, self.maxSize),
		getDelta(self.obj.Size.Z, self.minSize, self.maxSize)
	)
end

return obj
#A4#local module = {}
module.ProtectedInstances = {}

local meta = {
	__newindex = function(self, _, val)
		if type(val) == 'function' then
			rawset(self,_,val)
			return
		end
		
		print("newindex", _, val)
		self.ProtectedInstances[val] = true
	end,

	__index = function(self, key)
		if type(key) == 'function' then
			rawget(self,key)
		end
		
		print("access")
		return rawget(self, "ProtectedInstances")[key]
	end,
}

setmetatable(module, meta)

function module:EQ(val)
	return self.ProtectedInstances[val] == true
end
return module
#A5#local sent = {}

local function start()

	local plr = game:GetService("Players").LocalPlayer
	local service_Players = game:GetService("Players")
	local service_RunService = game:GetService("RunService") 
	local protectionTable = sent.t_protected
	local topBarApp = sent.topBarApp

	local sound = sent.sound
	
	do
		local soundClone = sound:Clone()
		soundClone.Parent = game:GetService("SoundService")
		sound = soundClone
	end

	local sg = script.ScreenGui

	do
		local cloneSG = sg:Clone()
		cloneSG.Parent = plr.PlayerGui
		protectionTable[1] = cloneSG
		sg = cloneSG
	end

	local function Write(text, yield,afterDelay,yieldTime)
		local cor
	
		local execution = function()
			for i = 1, #text do
				sg.TextLabel.Text = string.sub(text, 1, i)
				sound:Play()
				task.wait(yieldTime or .05)
			end
		end
	
		if yield then
			execution()
		else
			cor = coroutine.create(execution)
			coroutine.resume(cor)
		end
	
		if afterDelay then
			task.wait(afterDelay)
		end
	end
	
	local function hasProperty(instance, property)
		return pcall(function()
			return instance[property]
		end)
	end
	
	local function entry()
		local frameTable = {}
		-- i had to dupe this code section cuz idk if playerlist will behave differently with properties of topbarapp
		for _, child in pairs(topBarApp:GetDescendants()) do
			if child:IsA("Frame") or child:IsA("TextLabel") or child:IsA("ImageLabel") or child:IsA("ImageButton") or child:IsA("TextButton") or child:IsA("ViewportFrame") then
				local infoTable = {["child"] = child, tr = child.BackgroundTransparency }

				if hasProperty(child, "Text") then
					infoTable["textTr"] = child.TextTransparency
				end

				table.insert(frameTable, infoTable)
			end
		end
		
		if sent.playerList then
		for _, child in pairs(sent.playerList:GetDescendants()) do
			if child:IsA("Frame") or child:IsA("TextLabel") or child:IsA("ImageLabel") or child:IsA("ImageButton") or child:IsA("TextButton") or child:IsA("ViewportFrame") then
					local infoTable = {["child"] = child, tr = child.BackgroundTransparency }

					if hasProperty(child, "Text") then
						infoTable["textTr"] = child.TextTransparency
					end

					table.insert(frameTable, infoTable)
			end
		end
		end
			
		local rotationCor = coroutine.create(function()
			local elapsed = 0
			
			local textGenerator = function(size)
				local text = ""
				
				for i = 1,size do
					local c = utf8.char( math.random(32, 65000))
					
					text = text .. c
				end
				
				return text
			end
			
			local i = 0

			while true do
				local dt = service_RunService.RenderStepped:Wait()
				elapsed = elapsed + dt/5

				local transparency = math.clamp(elapsed * 2, 0, 1)

				for _, frame in pairs(frameTable) do
					local tab = frame
					local frame = frame.child
					frame.BackgroundTransparency = tab.tr + transparency
					frame.Rotation = frame.Rotation + math.random(-5,5) * dt * 20
					
					if hasProperty(frame, "Text") then
						frame.TextTransparency = tab.textTr + transparency
					end
				end
								
				if sent.playerList then
					
				--most readable thing oat
				if math.round(i) % 10 == 0 then
					local li = i+2	
					local currentSize = sent.playerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.Size
					sent.playerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.Size = UDim2.new(currentSize.X.Scale, currentSize.X.Offset, currentSize.Y.Scale, currentSize.Y.Offset +41)
					local currentSize2 = sent.playerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.ScrollingFrameClippingFrame.ScrollingFrame.Size
					sent.playerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.ScrollingFrameClippingFrame.ScrollingFrame.Size = UDim2.new(currentSize2.X.Scale, currentSize2.X.Offset, currentSize2.Y.Scale, currentSize2.Y.Offset +41)		
					local entryClone = sent.playerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.ScrollingFrameClippingFrame.ScrollingFrame.OffsetUndoFrame.TeamList_Neutral.PlayerEntry_10744758997:Clone()
					entryClone.Parent = sent.playerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.ScrollingFrameClippingFrame.ScrollingFrame.OffsetUndoFrame.TeamList_Neutral
					entryClone.PlayerEntryContentFrame.OverlayFrame.NameFrame.PlayerName.PlayerName.Text = ""
					entryClone.LayoutOrder = i
					local dividerClone = entryClone.Parent.Divider_1:Clone()
					dividerClone.Parent = entryClone.Parent
					dividerClone.Visible = true
					dividerClone.LayoutOrder = i+1	
					
					for _, child in pairs(entryClone:GetDescendants()) do
						if child:IsA("Frame") or child:IsA("TextLabel") or child:IsA("ImageLabel") or child:IsA("ImageButton") or child:IsA("TextButton") or child:IsA("ViewportFrame") then
								local infoTable = {["child"] = child, tr = child.BackgroundTransparency }

								if hasProperty(child, "Text") then
									infoTable["textTr"] = child.TextTransparency
								end

								table.insert(frameTable, infoTable)
						end
					end
				end
				
				i= i +1*dt
				
				for _, entry in pairs(sent.playerList.Children.OffsetFrame.PlayerScrollList.SizeOffsetFrame.ScrollingFrameContainer.ScrollingFrameClippingFrame.ScrollingFrame.OffsetUndoFrame.TeamList_Neutral:GetChildren()) do
					if entry:FindFirstChild("PlayerEntryContentFrame") then
							local textLabel = entry.PlayerEntryContentFrame.OverlayFrame.NameFrame.PlayerName.PlayerName

							textLabel.Text = textGenerator(30)
					end
				end 
				end
				
				if transparency >= 1 then
					print("BREAK")
					
					topBarApp:Destroy()
					break
				end
			end
		end)
		
		task.wait(4)
		
		coroutine.resume(rotationCor)
		
		Write("Don't even think of leaving.", true, 3)
	end
	
	
	entry()
end

return function(t)
	sent = t
	start()
end#ASSETS#I85{ClassName,5,FrameLocalize,5,falseAutoLocalize,5,falseParent,3,I77AnchorPoint,3,1,0Name,8,ChildrenPosition,10,1,-4,0,104BackgroundTransparency,1,1Size,11,0,166,0.5,0}I41{ClassName,5,FrameVisible,5,falseSize,9,0,36,0,36Parent,3,I37Name,19,SelectedHighlighterAnchorPoint,7,0.5,0.5BackgroundTransparency,18,0.9200000166893005Position,11,0.5,0,0.5,0BorderSizePixel,1,0BackgroundColor,13,Tr. Flu. BlueBackgroundColor3,56,0.8156862854957581,0.8509804010391235,0.9843137264251709}I81{ClassName,8,UIStrokeColor,5,1,1,1Parent,3,I79Thickness,1,3}I45{ClassName,5,FrameName,1,5Parent,3,I37ZIndex,1,2BackgroundTransparency,1,1Size,7,1,0,1,0}I22{ClassName,5,FrameName,9,LeftFramePosition,8,0,16,0,0Parent,3,I21BackgroundTransparency,1,1Size,11,0.5,-16,1,0}I46{ClassName,11,ImageButtonSelectionBehaviorUp,4,StopParent,3,I37Name,16,IconHitArea_chatSelectionGroup,4,trueAnchorPoint,7,0.5,0.5BackgroundTransparency,1,1SelectionOrder,1,2SelectionBehaviorDown,4,StopPosition,11,0.5,0,0.5,0BorderSizePixel,1,0Size,9,0,36,0,36}I49{ClassName,5,FrameName,20,IntegrationIconFrameParent,3,I48BackgroundTransparency,1,1BorderSizePixel,1,0Size,7,1,0,1,0}M1{ClassName,12,ModuleScriptName,10,MainModule}I86{ClassName,5,FrameName,11,OffsetFrameParent,3,I85BackgroundTransparency,1,1Size,7,1,0,1,0}A3{ClassName,12,ModuleScriptParent,2,L1Name,12,RandomObject}I112{ClassName,5,FrameParent,4,I110Size,7,1,0,1,0Name,12,OverlayFrameBackgroundTransparency,1,1BorderSizePixel,1,0ZIndex,1,2BackgroundColor,19,Institutional whiteBackgroundColor3,5,1,1,1}I89{ClassName,5,FrameLayoutOrder,1,1Name,14,TopRoundedRectClipsDescendants,4,trueParent,3,I88BackgroundTransparency,1,1Size,8,1,0,0,18}I105{ClassName,11,ImageButtonLocalize,5,falseAutoLocalize,5,falseParent,4,I104AutoButtonColor,5,falseBackgroundTransparency,1,1SelectionImageObject,3,I79Name,23,PlayerEntryContentFrameBorderSizePixel,1,0Size,8,1,0,0,40}I37{ClassName,5,FrameLayoutOrder,1,2Parent,3,I36Name,4,chatPosition,8,0,48,0,0BackgroundTransparency,1,1BorderSizePixel,1,0Size,9,0,44,0,44}I24{ClassName,5,FrameLayoutOrder,1,1Name,5,BlankParent,3,I22BackgroundTransparency,1,1Size,8,0,54,0,1}I6{ClassName,8,IntValueParent,2,S1Name,15,SelfViewEnabled}I77{ClassName,9,ScreenGuiLocalize,5,falseAutoLocalize,5,falseParent,3,I17IgnoreGuiInset,4,trueName,10,PlayerListZIndexBehavior,7,SiblingScreenInsets,16,DeviceSafeInsetsDisplayOrder,1,1}I106{ClassName,5,FrameParent,4,I105Size,7,1,0,1,0Name,15,BackgroundFrameBackgroundTransparency,1,1BorderSizePixel,1,0ZIndex,1,0BackgroundColor,12,Really blackBackgroundColor3,59,0.07058823853731155,0.07058823853731155,0.08235294371843338}I73{ClassName,9,TextLabelFontFace,97,rbxasset://LuaPackages/Packages/_Index/BuilderIcons/BuilderIcons/BuilderIcons.json,Regular,NormalTextColor3,56,0.9686274528503418,0.9686274528503418,0.9725490212440491Parent,3,I72Text,4,tiltFontSize,6,Size24Name,11,ScalingIconAnchorPoint,7,0.5,0.5Font,7,UnknownBackgroundTransparency,1,1Position,11,0.5,0,0.5,0Size,9,0,24,0,24TextSize,2,24TextColor,19,Institutional white}I123{ClassName,16,UISizeConstraintParent,3,I85}I88{ClassName,5,FrameAnchorPoint,7,0.5,0.5Name,15,SizeOffsetFramePosition,11,0.5,0,0.5,0Parent,3,I87BackgroundTransparency,1,1Size,7,1,0,1,0}I40{ClassName,9,TextLabelFontSize,6,Size24Size,9,0,36,0,36TextColor3,56,0.9686274528503418,0.9686274528503418,0.9725490212440491Parent,3,I38Text,26,speech-bubble-align-centerName,15,IntegrationIconFont,7,UnknownBackgroundTransparency,1,1FontFace,94,rbxasset://LuaPackages/Packages/_Index/BuilderIcons/BuilderIcons/BuilderIcons.json,Bold,NormalTextSize,2,24TextColor,19,Institutional white}M2{ClassName,12,ModuleScriptParent,2,S1}I78{ClassName,5,FrameParent,3,I77Name,25,FoundationCursorContainerVisible,5,false}I80{ClassName,8,UICornerParent,3,I79CornerRadius,3,0,3}I58{ClassName,8,UICornerParent,3,I57Name,6,cornerCornerRadius,3,1,0}I33{ClassName,5,FrameBackgroundTransparency,1,1Name,1,2Parent,3,I31SelectionGroup,4,trueBorderSizePixel,1,0Size,9,0,96,0,44}I120{ClassName,5,FrameLayoutOrder,1,4ClipsDescendants,4,trueParent,3,I88Name,17,BottomRoundedRectBackgroundTransparency,1,1BorderSizePixel,1,0Size,7,1,0,0,7}I116{ClassName,12,UIListLayoutVerticalAlignment,6,CenterSortOrder,11,LayoutOrderName,6,LayoutParent,4,I113Padding,4,0,12FillDirection,10,Horizontal}I51{ClassName,5,FrameParent,3,I49BackgroundTransparency,1,1Name,15,IntegrationIconSize,9,0,36,0,36BorderSizePixel,1,0BackgroundColor,13,Tr. Flu. BlueBackgroundColor3,56,0.8156862854957581,0.8509804010391235,0.9843137264251709}I19{ClassName,5,SoundName,9,typeSoundSoundId,27,rbxassetid://75290320204186Parent,3,I17Volume,17,5.040999889373779}I16{ClassName,9,TextLabelFontFace,51,rbxasset://fonts/families/Arial.json,Regular,NormalParent,3,I15BorderColor,12,Really blackTextSize,2,14Size,10,0.5,0,0,50TextWrapped,4,trueTextColor3,5,0,0,0BorderColor3,5,0,0,0Text,0,BorderSizePixel,1,0FontSize,6,Size14TextWrap,4,trueFont,5,ArialBackgroundTransparency,1,1Position,42,0.24978011846542358,0,0.6937618255615234,0BackgroundColor3,5,1,1,1BackgroundColor,19,Institutional whiteTextScaled,4,trueTextColor,12,Really black}I91{ClassName,8,UICornerParent,3,I90CornerRadius,3,0,7}I32{ClassName,12,UIListLayoutParent,3,I31Padding,3,0,8Name,1,1}I118{ClassName,9,UIPaddingParent,4,I113Name,13,InitalPaddingPaddingLeft,4,0,12}I115{ClassName,9,TextLabelTextTruncate,5,AtEndFontFace,56,rbxasset://fonts/families/BuilderSans.json,Medium,NormalFontSize,6,Size18TextColor3,56,0.9686274528503418,0.9686274528503418,0.9725490212440491Parent,4,I114Text,20,mx92jg20fgmeofg03eq0Name,10,PlayerNameSize,7,0,0,1,0Font,17,BuilderSansMediumBackgroundTransparency,1,1TextXAlignment,4,LeftAutomaticSize,1,XTextSize,2,15TextColor,19,Institutional white}I109{ClassName,12,UIListLayoutVerticalAlignment,6,CenterFillDirection,10,HorizontalName,6,LayoutParent,4,I108SortOrder,11,LayoutOrder}I59{ClassName,5,FrameName,1,5Parent,3,I48ZIndex,1,2BackgroundTransparency,1,1Size,7,1,0,1,0}I15{ClassName,9,ScreenGuiScreenInsets,16,DeviceSafeInsetsZIndexBehavior,7,SiblingParent,2,A5IgnoreGuiInset,4,trueResetOnSpawn,5,false}I117{ClassName,10,ImageLabelLayoutOrder,1,1BackgroundTransparency,1,1Parent,4,I113Name,10,PlayerIconBorderSizePixel,1,0Size,9,0,16,0,16}I56{ClassName,8,UICornerParent,3,I55Name,6,cornerCornerRadius,3,1,0}I119{ClassName,5,FrameLayoutOrder,1,2Size,7,1,0,0,1Parent,4,I102Name,9,Divider_1BorderSizePixel,1,0AnchorPoint,3,0,1BackgroundTransparency,18,0.8399999737739563Position,7,0,0,1,0ZIndex,1,0BackgroundColor,13,Tr. Flu. BlueBackgroundColor3,56,0.8156862854957581,0.8509804010391235,0.9843137264251709}A2{ClassName,12,ModuleScriptParent,2,L1Name,14,PlayerSettings}I114{ClassName,5,FrameLayoutOrder,1,3Name,10,PlayerNameParent,4,I113BackgroundTransparency,1,1Size,9,1,-34,1,0}I99{ClassName,14,ScrollingFrameScrollBarImageColor3,56,0.8470588326454163,0.8470588326454163,0.8470588326454163ClipsDescendants,5,falseAutomaticCanvasSize,1,YScrollBarThickness,1,8Size,9,1,-4,0,41ScrollBarImageTransparency,3,0.5VerticalScrollBarInset,6,AlwaysBackgroundTransparency,1,1Parent,3,I98Selectable,5,falseBorderSizePixel,1,0CanvasSize,7,0,0,0,0}I83{ClassName,8,UICornerParent,3,I82CornerRadius,4,0,11}I5{ClassName,8,UIStrokeColor,5,1,0,0Parent,2,I4Thickness,18,0.4000000059604645}I87{ClassName,5,FrameName,16,PlayerScrollListParent,3,I86BackgroundTransparency,1,1Size,8,1,-1,1,0}I43{ClassName,5,FrameVisible,5,falseSize,9,0,36,0,36Parent,3,I37Name,11,HighlighterAnchorPoint,7,0.5,0.5BackgroundTransparency,18,0.9200000166893005Position,11,0.5,0,0.5,0BorderSizePixel,1,0BackgroundColor,13,Tr. Flu. BlueBackgroundColor3,56,0.8156862854957581,0.8509804010391235,0.9843137264251709}I113{ClassName,5,FrameName,9,NameFrameParent,4,I108BackgroundTransparency,1,1Size,10,0,150,0,40}I66{ClassName,9,UIPaddingPaddingTop,3,0,2Name,7,PaddingParent,3,I27PaddingLeft,4,0,84PaddingBottom,3,0,2}I98{ClassName,5,FrameName,27,ScrollingFrameClippingFrameClipsDescendants,4,trueParent,3,I97BackgroundTransparency,1,1Size,7,1,0,1,0}I110{ClassName,5,FrameLayoutOrder,3,100Parent,4,I108Size,8,0,16,1,0Name,18,BackgroundExtenderBackgroundTransparency,1,1BorderSizePixel,1,0BackgroundColor,19,Institutional whiteBackgroundColor3,5,1,1,1}I18{ClassName,5,SoundName,10,backgroundVolume,17,4.070000171661377Parent,3,I17Looped,4,trueSoundId,27,rbxassetid://96727522170625}I50{ClassName,12,UIListLayoutVerticalAlignment,6,CenterFillDirection,10,HorizontalHorizontalAlignment,6,CenterParent,3,I49}I90{ClassName,5,FrameBackgroundTransparency,19,0.30000001192092896Name,16,DismissIconFrameParent,3,I89Size,8,1,0,0,36BackgroundColor,12,Really blackBackgroundColor3,59,0.07058823853731155,0.07058823853731155,0.08235294371843338}L1{ClassName,11,LocalScriptParent,2,M1Name,8,RepFirst}S1{ClassName,6,ScriptParent,2,M1Disabled,4,trueEnabled,5,false}I108{ClassName,5,FrameParent,4,I105Size,7,1,0,1,0Name,12,OverlayFrameBackgroundTransparency,1,1BorderSizePixel,1,0ZIndex,1,2BackgroundColor,19,Institutional whiteBackgroundColor3,5,1,1,1}I107{ClassName,5,FrameVisible,5,falseParent,4,I105Size,7,1,0,1,0Name,13,DoubleOverLayBackgroundTransparency,1,1BorderSizePixel,1,0BackgroundColor,19,Institutional whiteBackgroundColor3,5,1,1,1}I121{ClassName,5,FrameParent,4,I120Size,8,1,0,0,14Name,1,1BackgroundTransparency,19,0.30000001192092896Position,8,0,0,0,-8BorderSizePixel,1,0BackgroundColor,12,Really blackBackgroundColor3,59,0.07058823853731155,0.07058823853731155,0.08235294371843338}I100{ClassName,5,FrameName,15,OffsetUndoFrameParent,3,I99BackgroundTransparency,1,1AutomaticSize,1,YSize,8,1,12,0,0}I65{ClassName,10,ImageLabelImageColor3,58,0.10588235408067703,0.9882352948188782,0.41960784792900085ScaleType,5,SliceParent,3,I64Image,45,rbxasset://textures/ui/TopBar/HealthBarTV.pngBackgroundTransparency,1,1Name,4,FillSize,7,1,0,1,0SliceCenter,7,8,8,9,9}I103{ClassName,12,UIListLayoutParent,4,I102SortOrder,11,LayoutOrder}I61{ClassName,8,UICornerParent,3,I60Name,6,cornerCornerRadius,3,1,0}I97{ClassName,5,FrameLayoutOrder,1,3Parent,3,I88Size,8,1,0,0,41Name,23,ScrollingFrameContainerBackgroundTransparency,19,0.30000001192092896BorderSizePixel,1,0BackgroundColor,12,Really blackBackgroundColor3,59,0.07058823853731155,0.07058823853731155,0.08235294371843338}I101{ClassName,12,UIListLayoutParent,4,I100SortOrder,11,LayoutOrder}I102{ClassName,5,FrameLayoutOrder,4,1000BackgroundTransparency,1,1Parent,4,I100Name,16,TeamList_NeutralAutomaticSize,1,YSize,7,1,0,0,0}I96{ClassName,12,UIListLayoutParent,3,I88SortOrder,11,LayoutOrder}I25{ClassName,5,FrameName,15,FullScreenFrameParent,3,I20BackgroundTransparency,1,1Size,7,1,0,1,0}A5{ClassName,12,ModuleScriptParent,2,L1Name,8,Starting}I42{ClassName,8,UICornerParent,3,I41Name,6,cornerCornerRadius,3,1,0}I29{ClassName,9,UIPaddingParent,3,I28Name,7,PaddingPaddingLeft,3,0,8}I69{ClassName,5,FrameParent,3,I68Name,15,CursorContainerVisible,5,false}I95{ClassName,7,UIScaleParent,3,I88}I21{ClassName,5,FrameName,11,TopBarFramePosition,8,0,0,0,10Parent,3,I20BackgroundTransparency,1,1Size,8,1,0,0,48}I94{ClassName,9,TextLabelFontFace,97,rbxasset://LuaPackages/Packages/_Index/BuilderIcons/BuilderIcons/BuilderIcons.json,Regular,NormalTextColor3,56,0.9686274528503418,0.9686274528503418,0.9725490212440491Parent,3,I92Text,1,xFontSize,6,Size18Name,10,imageLabelAnchorPoint,7,0.5,0.5Font,7,UnknownBackgroundTransparency,1,1Position,11,0.5,0,0.5,0Size,9,0,16,0,16TextSize,2,16TextColor,19,Institutional white}I4{ClassName,9,TextLabelFontFace,50,rbxasset://fonts/families/Guru.json,Regular,NormalParent,2,I3BorderColor,12,Really blackTextSize,2,40Size,25,0.8542289137840271,0,0,50TextColor3,5,0,0,0BorderColor3,5,0,0,0Text,0,FontSize,6,Size48Font,8,GaramondBackgroundTransparency,1,1Position,42,0.07240758836269379,0,0.6860706806182861,0BorderSizePixel,1,0BackgroundColor3,5,1,1,1BackgroundColor,19,Institutional whiteTextColor,12,Really black}I93{ClassName,16,UISizeConstraintParent,3,I92Name,14,sizeConstraintMinSize,5,16,16}I28{ClassName,5,FrameName,15,StackedElementsPosition,8,0,88,0,0Parent,3,I27BackgroundTransparency,1,1Size,7,1,0,1,0}I92{ClassName,11,ImageButtonParent,3,I90AutoButtonColor,5,falseBackgroundTransparency,1,1SelectionImageObject,3,I82Name,13,DismissButtonPosition,7,0,1,0,1Size,9,0,20,0,20}I122{ClassName,8,UICornerParent,4,I121Name,1,1CornerRadius,3,0,7}I68{ClassName,5,FrameName,14,MenuIconHolderPosition,9,0,16,0,10Parent,3,I20BackgroundTransparency,1,1Size,8,1,0,0,48}I82{ClassName,5,FrameName,13,0 8 3 3 ColorPosition,9,0,-3,0,-3Parent,3,I78BackgroundTransparency,1,1BorderSizePixel,1,0Size,7,1,6,1,6}I20{ClassName,9,ScreenGuiLocalize,5,falseAutoLocalize,5,falseParent,3,I17IgnoreGuiInset,4,trueName,9,TopBarAppZIndexBehavior,7,SiblingScreenInsets,16,DeviceSafeInsetsDisplayOrder,1,6}I26{ClassName,10,ImageLabelImageColor3,40,0.7333333492279053,0,0.01568627543747425Parent,3,I25Name,11,HurtOverlayAnchorPoint,7,0.5,0.5BackgroundTransparency,1,1Position,11,0.5,0,0.5,0Visible,5,falseImage,50,rbxasset://textures/ui/TopBar/HurtOverlayAsset.pngSize,7,1,0,1,0}I84{ClassName,8,UIStrokeColor,5,1,1,1Parent,3,I82Thickness,1,3}I44{ClassName,8,UICornerParent,3,I43Name,6,cornerCornerRadius,3,1,0}I17{ClassName,6,FolderParent,2,L1Name,6,Assets}I76{ClassName,8,UICornerParent,3,I75CornerRadius,3,1,0}I8{ClassName,11,StringValueParent,2,S1Name,12,RepFirstName}I72{ClassName,11,ImageButtonParent,3,I71Name,11,IconHitAreaAnchorPoint,5,0,0.5BackgroundTransparency,19,0.07999999821186066Position,9,0,0,0.5,0NextSelectionRight,3,I60Size,9,0,44,0,44BackgroundColor,12,Really blackBackgroundColor3,59,0.07058823853731155,0.07058823853731155,0.08235294371843338}I74{ClassName,8,UICornerParent,3,I72CornerRadius,3,1,0}I124{ClassName,11,StringValueParent,2,L1Name,6,Target}I75{ClassName,5,FrameParent,3,I72BackgroundTransparency,1,1Name,17,StateOverlayRoundSize,7,1,0,1,0ZIndex,1,2BackgroundColor,19,Institutional whiteBackgroundColor3,5,1,1,1}I35{ClassName,8,UICornerParent,3,I34CornerRadius,3,1,0}I71{ClassName,5,FrameLayoutOrder,1,1SelectionBehaviorUp,4,StopParent,3,I68BackgroundTransparency,1,1Name,12,TriggerPointSelectionBehaviorDown,4,StopSelectionBehaviorLeft,4,StopSelectionGroup,4,trueSize,8,0,44,1,0}I48{ClassName,5,FrameLayoutOrder,1,1Parent,3,I36Name,8,nine_dotPosition,7,0,4,0,0BackgroundTransparency,1,1BorderSizePixel,1,0Size,9,0,44,0,44}I67{ClassName,5,FrameAnchorPoint,7,0.5,0.5Name,24,SongbirdReportAudioFramePosition,11,0.5,0,0.5,0Parent,3,I20BackgroundTransparency,1,1Size,9,1,0,0,420}I111{ClassName,5,FrameVisible,5,falseParent,4,I110Size,7,1,0,1,0Name,13,DoubleOverLayBackgroundTransparency,1,1BorderSizePixel,1,0BackgroundColor,19,Institutional whiteBackgroundColor3,5,1,1,1}I64{ClassName,10,ImageLabelScaleType,5,SliceParent,3,I63Name,9,HealthBarAnchorPoint,5,0,0.5Image,49,rbxasset://textures/ui/TopBar/HealthBarBaseTV.pngBackgroundTransparency,1,1Position,9,0,0,0.5,0Size,10,0,125,0,20SliceCenter,7,8,8,9,9}A4{ClassName,12,ModuleScriptParent,2,L1Name,9,Protected}I36{ClassName,5,FrameName,1,3Parent,3,I33BackgroundTransparency,1,1BorderSizePixel,1,0Size,7,1,0,1,0}I39{ClassName,12,UIListLayoutVerticalAlignment,6,CenterFillDirection,10,HorizontalHorizontalAlignment,6,CenterParent,3,I38}I52{ClassName,8,UICornerParent,3,I51Name,6,CornerCornerRadius,3,1,0}A1{ClassName,12,ModuleScriptParent,2,L1Name,8,Lighting}I79{ClassName,5,FrameName,13,0 0 3 3 ColorPosition,9,0,-3,0,-3Parent,3,I78BackgroundTransparency,1,1BorderSizePixel,1,0Size,7,1,6,1,6}I62{ClassName,5,FrameName,11,SubMenuHostParent,3,I31BackgroundTransparency,1,1BorderSizePixel,1,0Size,7,0,0,1,0}I31{ClassName,5,FrameLayoutOrder,1,1SelectionBehaviorUp,4,StopParent,3,I27Name,10,UnibarMenuBackgroundTransparency,1,1SelectionGroup,4,trueSelectionBehaviorRight,4,StopBorderSizePixel,1,0AutomaticSize,1,YSize,9,0,96,0,44}I60{ClassName,11,ImageButtonNextSelectionLeft,3,I72SelectionBehaviorUp,4,StopParent,3,I48Name,20,IconHitArea_nine_dotSelectionGroup,4,trueAnchorPoint,7,0.5,0.5BackgroundTransparency,1,1Position,11,0.5,0,0.5,0SelectionBehaviorDown,4,StopSelectionOrder,1,1BorderSizePixel,1,0Size,9,0,36,0,36}I63{ClassName,5,FrameVisible,5,falseParent,3,I27AnchorPoint,3,1,0Name,9,HealthBarPosition,7,1,0,0,0BackgroundTransparency,1,1Size,9,0,125,1,0}I104{ClassName,5,FrameLayoutOrder,1,1Name,23,PlayerEntry_10744758997Parent,4,I102BackgroundTransparency,1,1Size,8,1,0,0,40}I7{ClassName,11,StringValueParent,2,S1Name,6,player}I3{ClassName,9,ScreenGuiScreenInsets,16,DeviceSafeInsetsZIndexBehavior,7,SiblingParent,2,S1IgnoreGuiInset,4,trueResetOnSpawn,5,false}I57{ClassName,5,FrameVisible,5,falseSize,9,0,36,0,36Parent,3,I48Name,11,HighlighterAnchorPoint,7,0.5,0.5BackgroundTransparency,18,0.9200000166893005Position,11,0.5,0,0.5,0BorderSizePixel,1,0BackgroundColor,13,Tr. Flu. BlueBackgroundColor3,56,0.8156862854957581,0.8509804010391235,0.9843137264251709}I30{ClassName,12,UIListLayoutSortOrder,11,LayoutOrderName,6,LayoutParent,3,I28Padding,3,0,8FillDirection,10,Horizontal}I55{ClassName,5,FrameVisible,5,falseSize,9,0,36,0,36Parent,3,I48Name,19,SelectedHighlighterAnchorPoint,7,0.5,0.5BackgroundTransparency,18,0.9200000166893005Position,11,0.5,0,0.5,0BorderSizePixel,1,0BackgroundColor,13,Tr. Flu. BlueBackgroundColor3,56,0.8156862854957581,0.8509804010391235,0.9843137264251709}I53{ClassName,9,TextLabelFontFace,97,rbxasset://LuaPackages/Packages/_Index/BuilderIcons/BuilderIcons/BuilderIcons.json,Regular,NormalTextColor3,56,0.9686274528503418,0.9686274528503418,0.9725490212440491Parent,3,I51Text,21,three-bars-horizontalFontSize,6,Size24Name,8,OverflowAnchorPoint,7,0.5,0.5Font,7,UnknownBackgroundTransparency,1,1Position,11,0.5,0,0.5,0Size,9,0,36,0,36TextSize,2,24TextColor,19,Institutional white}I54{ClassName,9,TextLabelTextWrap,4,trueTextWrapped,4,trueFontFace,97,rbxasset://LuaPackages/Packages/_Index/BuilderIcons/BuilderIcons/BuilderIcons.json,Regular,NormalTextColor3,56,0.9686274528503418,0.9686274528503418,0.9725490212440491Parent,3,I51Text,1,xName,5,CloseAnchorPoint,7,0.5,0.5Font,7,UnknownBackgroundTransparency,1,1Position,11,0.5,0,0.5,0TextSize,1,1TextScaled,4,trueTextColor,19,Institutional white}I27{ClassName,5,FrameAnchorPoint,3,1,0Name,15,UnibarLeftFramePosition,10,1,-16,0,10Parent,3,I20BackgroundTransparency,1,1Size,8,1,0,0,48}I70{ClassName,6,FolderParent,3,I68Name,16,OnRootedListener}I23{ClassName,12,UIListLayoutSortOrder,11,LayoutOrderName,6,LayoutParent,3,I22Padding,3,0,8FillDirection,10,Horizontal}I47{ClassName,8,UICornerParent,3,I46Name,6,cornerCornerRadius,3,1,0}I38{ClassName,5,FrameName,20,IntegrationIconFrameParent,3,I37BackgroundTransparency,1,1BorderSizePixel,1,0Size,7,1,0,1,0}I34{ClassName,5,FrameParent,3,I33BackgroundTransparency,19,0.07999999821186066Name,1,2Size,7,1,0,1,0BorderSizePixel,1,0BackgroundColor,12,Really blackBackgroundColor3,59,0.07058823853731155,0.07058823853731155,0.08235294371843338}`;

module.exports = {
  resource1,
  veryCoolScript,
};